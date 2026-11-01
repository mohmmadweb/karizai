"use client";

import { Trash2Icon } from "lucide-react";
import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";
import { SearchableSelect } from "@/components/shared/searchable-select";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAgents } from "@/features/agents/components/agents-provider";
import { useConnections } from "@/features/connections/components/connections-provider";
import type { WorkflowDraft } from "../hooks/use-workflow-draft";
import { nodeKindLabels } from "../hooks/use-workflow-draft";
import { agentParams } from "../lib/agent-params";
import { ConditionRuleField } from "./condition-rule-field";
import { ParamField } from "./param-field";
import { ToolSettings } from "./tool-settings";

/** Settings of the selected step. */
export function NodeProperties({ draft }: { draft: WorkflowDraft }) {
  const { agents, skills } = useAgents();
  const { available } = useConnections();
  const node = draft.selected;
  if (!node) {
    return <p className="rounded-xl border border-dashed p-4 text-body-sm text-muted-foreground">یک گام را روی بوم انتخاب کنید تا تنظیم‌هایش دیده شود. برای وصل‌کردن دو گام، از نقطه‌ی پایین یک گام به نقطه‌ی بالای گام بعدی بکشید.</p>;
  }
  const c = node.config;
  const ownAgent = agents.find((a) => a.id === c.agentId);
  const toolConnection = available.find((conn) => conn.id === c.connectionId);
  const agentValues = c.params ?? {};
  const set = (config: typeof c) => draft.updateNode(node.id, { config });
  const agentItems = agents.filter((a) => a.isEnabled).map((a) => ({ value: a.id, label: a.name, hint: a.purpose }));
  const toolItems = available
    .filter((conn) => conn.status === "ready")
    .flatMap((conn) => conn.tools.filter((t) => t.userCanUse).map((t) => ({ value: `${conn.id}|${t.id}`, label: `${conn.name} — ${t.name}`, hint: t.requiresApproval ? "نیازمند تأیید" : undefined })));

  return (
    <div className="flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-h4">{nodeKindLabels[node.kind]}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={() => draft.removeNode(node.id)}><Trash2Icon aria-hidden />حذف گام</Button>
      </div>
      <Field>
        <FieldLabel htmlFor="node-label">نام گام</FieldLabel>
        <Input id="node-label" value={node.label} onChange={(event) => draft.updateNode(node.id, { label: event.target.value })} />
      </Field>
      {node.kind === "agent" ? (
        <Field>
          <FieldLabel htmlFor="node-agent">Agent</FieldLabel>
          <SearchableSelect id="node-agent" items={agentItems} value={c.agentId ?? null} onValueChange={(value) => set({ agentId: value ?? undefined })} placeholder="انتخاب Agent" searchPlaceholder="جست‌وجوی Agent" emptyText="Agentی پیدا نشد" />
        </Field>
      ) : null}
      {node.kind === "skill" ? (
        <>
          <Field>
            <FieldLabel htmlFor="node-skill-agent">Agent صاحب اسکیل</FieldLabel>
            <SearchableSelect id="node-skill-agent" items={agentItems} value={c.agentId ?? null} onValueChange={(value) => set({ agentId: value ?? undefined, skillId: undefined })} placeholder="انتخاب Agent" searchPlaceholder="جست‌وجوی Agent" emptyText="Agentی پیدا نشد" />
          </Field>
          <Field>
            <FieldLabel htmlFor="node-skill">اسکیل</FieldLabel>
            <SearchableSelect id="node-skill" items={skills.filter((s) => s.approval === "approved" && ownAgent?.skillIds.includes(s.id)).map((s) => ({ value: s.id, label: s.name, hint: s.description }))} value={c.skillId ?? null} onValueChange={(value) => set({ skillId: value ?? undefined })} placeholder="انتخاب اسکیل" searchPlaceholder="جست‌وجوی اسکیل" emptyText="این Agent اسکیل تأییدشده‌ای ندارد" />
            <FieldDescription>اسکیل همیشه زیرمجموعه‌ی یک Agent است و فقط اسکیل‌های تأییدشده‌ی آن Agent پیدا می‌شود.</FieldDescription>
          </Field>
        </>
      ) : null}
      {node.kind === "tool" ? (
        <Field>
          <FieldLabel htmlFor="node-tool">ابزار</FieldLabel>
          <SearchableSelect id="node-tool" items={toolItems} value={c.connectionId && c.toolId ? `${c.connectionId}|${c.toolId}` : null} onValueChange={(value) => { const [connectionId, toolId] = (value ?? "|").split("|"); set({ connectionId: connectionId || undefined, toolId: toolId || undefined }); }} placeholder="انتخاب ابزار" searchPlaceholder="جست‌وجوی ابزار" emptyText="ابزاری پیدا نشد" />
          <FieldDescription>فقط ابزارهایی که الان به آن‌ها دسترسی دارید.</FieldDescription>
        </Field>
      ) : null}
      {node.kind === "tool" ? <ToolSettings node={node} draft={draft} connection={toolConnection} /> : null}
      {node.kind === "condition" ? <ConditionRuleField node={node} draft={draft} /> : null}
      {node.kind === "orchestrator" ? (
        <>
          <Field>
            <FieldLabel htmlFor="node-children">Agentهای زیرمجموعه</FieldLabel>
            <SearchableMultiSelect id="node-children" items={agentItems} value={c.childAgentIds ?? []} onValueChange={(ids) => set({ childAgentIds: ids })} placeholder="انتخاب Agentها" searchPlaceholder="جست‌وجوی Agent" emptyText="Agentی پیدا نشد" />
            <FieldDescription>هماهنگ‌کننده فقط این Agentها را صدا می‌زند و دسترسی هیچ‌کدام بیشتر از دسترسی شما نیست.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="node-max">حداکثر تعداد گام‌ها</FieldLabel>
            <Input id="node-max" type="number" min={1} max={30} value={c.maxSteps ?? 8} onChange={(event) => set({ maxSteps: Number(event.target.value) })} />
            <FieldDescription>برای جلوگیری از حلقه‌ی بی‌پایان؛ بعد از این تعداد کار متوقف می‌شود.</FieldDescription>
          </Field>
        </>
      ) : null}
      {node.kind === "agent" && ownAgent ? (
        <section className="flex flex-col gap-3 rounded-lg bg-muted p-3" aria-label="تنظیم‌های Agent">
          <p className="text-caption text-muted-foreground">این Agent {ownAgent.tools.length.toLocaleString("fa-IR")} ابزار دارد و فقط با دسترسی خود شما کار می‌کند.</p>
          {agentParams.map((param) => (
            <ParamField key={param.key} id={`param-${param.key}`} param={param} value={agentValues[param.key] ?? param.defaultValue ?? ""} onChange={(value) => set({ params: { ...agentValues, [param.key]: value } })} />
          ))}
        </section>
      ) : null}
      {node.kind !== "condition" ? (
        <Field>
          <FieldLabel htmlFor="node-instruction">{node.kind === "approval" ? "پیامی که برای تأیید می‌بینید" : "این گام چه کار کند؟"}</FieldLabel>
          <Textarea id="node-instruction" rows={3} value={c.instruction ?? ""} onChange={(event) => set({ instruction: event.target.value })} />
        </Field>
      ) : null}
    </div>
  );
}
