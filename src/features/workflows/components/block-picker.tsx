"use client";

import { cloneElement, useState, type ReactElement } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAgents } from "@/features/agents/components/agents-provider";
import { useConnections } from "@/features/connections/components/connections-provider";
import { defaultParams, toolParams } from "@/features/connections/lib/tool-params";
import { getMlModels } from "../data/ml-models";
import { agentParams } from "../lib/agent-params";
import { nodeKindLabels, type NewBlock } from "../hooks/use-workflow-draft";

/**
 * The drop-down behind the «+». Every block belongs to an Agent (its run or one of its skills) or to a
 * connection (one of its tools), ready filled in; only the route controls (condition, approval) stand alone.
 * `trigger` is the element that opens it (the «+» on a block, or the first-step box).
 */
export function BlockMenu({ trigger, heading, onPick, nativeTrigger = true }: { trigger: ReactElement<Record<string, unknown>>; heading: string; onPick: (block: NewBlock) => void; /** False when the trigger is not a real <button>, like the output handle of a block. */ nativeTrigger?: boolean }) {
  const { agents, skills } = useAgents();
  const { available } = useConnections();
  const [open, setOpen] = useState(false);

  // The menu opens on a click, not on the first press, so dragging from the «+» can still draw a connection.
  return (
    <DropdownMenu open={open} onOpenChange={(next, details) => { if (!(next && details?.reason === "trigger-press")) setOpen(next); }}>
      <DropdownMenuTrigger render={cloneElement(trigger, { onClick: () => setOpen(true) })} nativeButton={nativeTrigger} />
      <DropdownMenuContent side="left" align="start" className="max-h-80 min-w-48 overflow-y-auto">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{heading}</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>عامل‌ها و اسکیل‌هایشان</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
              <DropdownMenuItem onClick={() => onPick({ kind: "orchestrator" })}>{nodeKindLabels.orchestrator}</DropdownMenuItem>
              {agents.length === 0 ? <DropdownMenuItem disabled>عاملی نیست</DropdownMenuItem> : null}
              {agents.map((agent) => (
                <DropdownMenuSub key={agent.id}>
                  <DropdownMenuSubTrigger disabled={!agent.isEnabled}>{agent.name}{agent.isEnabled ? "" : " — غیرفعال"}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => onPick({ kind: "agent", label: agent.name, config: { agentId: agent.id, params: defaultParams(agentParams) } })}>اجرای این عامل</DropdownMenuItem>
                    {skills.filter((skill) => agent.skillIds.includes(skill.id)).map((skill) => (
                      <DropdownMenuItem key={skill.id} disabled={skill.approval !== "approved"} onClick={() => onPick({ kind: "skill", label: skill.name, config: { agentId: agent.id, skillId: skill.id } })}>
                        اسکیل: {skill.name}{skill.approval === "approved" ? "" : skill.approval === "pending" ? " — در انتظار تأیید" : " — ردشده"}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>اتصال‌ها و ابزارهایشان</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
              {available.length === 0 ? <DropdownMenuItem disabled>اتصالی نیست</DropdownMenuItem> : null}
              {available.map((connection) => (
                <DropdownMenuSub key={connection.id}>
                  <DropdownMenuSubTrigger disabled={connection.status !== "ready"}>
                    {connection.name}{connection.status === "needs-auth" ? " — نیازمند ورود" : ""}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {connection.tools.filter((tool) => tool.userCanUse).map((tool) => (
                      <DropdownMenuItem key={tool.id} onClick={() => onPick({ kind: "tool", label: tool.name, config: { connectionId: connection.id, toolId: tool.id, params: defaultParams(toolParams(tool)) } })}>
                        {tool.name}{tool.requiresApproval ? " (نیازمند تأیید)" : ""}
                      </DropdownMenuItem>
                    ))}
                    {connection.tools.length === 0 ? <DropdownMenuItem disabled>ابزاری نیست</DropdownMenuItem> : null}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>✦ گام‌های هوشمند و کد</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
              {(["prompt-optimizer", "router", "supervisor", "code"] as const).map((kind) => <DropdownMenuItem key={kind} onClick={() => onPick({ kind })}>{nodeKindLabels[kind]}</DropdownMenuItem>)}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>{nodeKindLabels["ml-model"]}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {getMlModels().map((model) => <DropdownMenuItem key={model.id} onClick={() => onPick({ kind: "ml-model", config: { mlModelId: model.id } })}>{model.name}</DropdownMenuItem>)}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>کنترل مسیر</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {(["condition", "approval", "fork", "join"] as const).map((kind) => <DropdownMenuItem key={kind} onClick={() => onPick({ kind })}>{nodeKindLabels[kind]}</DropdownMenuItem>)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
