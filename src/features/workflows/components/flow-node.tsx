"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { BotIcon, BrainCircuitIcon, CodeXmlIcon, GitBranchIcon, GitForkIcon, GitMergeIcon, PlusIcon, HandIcon, NetworkIcon, ShieldCheckIcon, SignpostIcon, SparklesIcon, WandSparklesIcon, WrenchIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewBlock } from "../hooks/use-workflow-draft";
import { BlockMenu } from "./block-picker";
import type { NodeKind, StepStatus } from "../types";

export type FlowNodeData = { label: string; kind: NodeKind; status?: StepStatus; subtitle?: string; /** Another step already follows this one. */ hasOutput?: boolean; onAdd?: (block: NewBlock) => void };
export type FlowNode = Node<FlowNodeData, "step">;

const icons: Record<NodeKind, LucideIcon> = {
  agent: BotIcon,
  skill: SparklesIcon,
  tool: WrenchIcon,
  condition: GitBranchIcon,
  approval: HandIcon,
  orchestrator: NetworkIcon,
  code: CodeXmlIcon,
  "ml-model": BrainCircuitIcon,
  "prompt-optimizer": WandSparklesIcon,
  router: SignpostIcon,
  supervisor: ShieldCheckIcon,
  fork: GitForkIcon,
  join: GitMergeIcon,
};

/** Steps made by AI carry the «✦» colour, as in the rest of the product. */
const aiKinds: NodeKind[] = ["agent", "skill", "orchestrator", "ml-model", "prompt-optimizer", "router", "supervisor"];

const ring: Partial<Record<StepStatus, string>> = {
  running: "border-info ring-2 ring-info/40",
  "waiting-approval": "border-warning ring-2 ring-warning/50",
  succeeded: "border-success ring-2 ring-success/40",
  failed: "border-destructive ring-2 ring-destructive/40",
  skipped: "opacity-50",
};

/** One step on the canvas. Arrows enter from the top and leave from the bottom. */
export function FlowStepNode({ data, selected }: NodeProps<FlowNode>) {
  const Icon = icons[data.kind];
  return (
    <div dir="rtl" className={cn("group relative flex w-52 items-center gap-3 rounded-xl border bg-card px-3 py-2 shadow-sm", selected && "border-primary ring-2 ring-primary/30", data.status && ring[data.status])}>
      <Handle type="target" position={Position.Top} />
      <Icon className={cn("size-5 shrink-0", aiKinds.includes(data.kind) ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground")} aria-hidden />
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-label">{data.label}</span>
        {data.subtitle ? <span className="truncate text-caption text-muted-foreground">{data.subtitle}</span> : null}
      </span>
      {data.onAdd ? (
        // The «+» is the output handle itself: it shows when the pointer is on the block,
        // and always when nothing follows the block yet. Dragging from it still connects.
        <BlockMenu
          heading={`این گام بعد از «${data.label}»`}
          onPick={data.onAdd}
          nativeTrigger={false}
          trigger={
            <Handle
              type="source"
              position={Position.Bottom}
              aria-label={`افزودن گام بعد از «${data.label}»`}
              className={cn(
                "!flex !size-6 !cursor-pointer !items-center !justify-center !rounded-full !border !bg-card !text-muted-foreground transition-opacity hover:!bg-primary hover:!text-primary-foreground focus-visible:opacity-100",
                data.hasOutput && "opacity-0 group-hover:opacity-100 data-[popup-open]:opacity-100",
              )}
            >
              <PlusIcon className="size-4" aria-hidden />
            </Handle>
          }
        />
      ) : (
        <Handle type="source" position={Position.Bottom} />
      )}
    </div>
  );
}
