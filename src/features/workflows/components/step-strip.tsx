import { cn } from "@/lib/utils";
import { describeTrigger } from "../lib/describe-trigger";
import { planRun } from "../lib/graph";
import type { NodeKind, Workflow } from "../types";

const aiKinds: NodeKind[] = ["agent", "skill", "orchestrator", "ml-model", "prompt-optimizer", "router", "supervisor"];

/** The main path of a workflow in one line: trigger, then each step («بله» paths of conditions). */
export function StepStrip({ workflow, max = 9 }: { workflow: Workflow; max?: number }) {
  const { order } = planRun(workflow.nodes, workflow.edges, () => "بله", () => false);
  const shown = order.slice(0, max);
  const trigger = workflow.triggers[0];
  const prefix = (kind: NodeKind, label: string) => (label.startsWith("✦") ? "" : kind === "approval" ? "✋ " : kind === "fork" ? "⑂ " : aiKinds.includes(kind) ? "✦ " : "");
  if (order.length === 0) return null;
  return (
    <ol className="flex flex-wrap items-center gap-1 text-caption" aria-label="گام‌های جریان">
      {trigger ? <li className="rounded-md border bg-muted/50 px-2 py-0.5">⏰ {describeTrigger(trigger).replace(/^زمان‌بندی: |^رویداد: /, "")}</li> : null}
      {shown.map((node) => (
        <li key={node.id} className="flex items-center gap-1">
          <span aria-hidden className="text-muted-foreground">←</span>
          <span className={cn("rounded-md border px-2 py-0.5", aiKinds.includes(node.kind) && "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300", node.kind === "approval" && "border-warning/50 bg-warning/15")}>
            {prefix(node.kind, node.label)}{node.label}
          </span>
        </li>
      ))}
      {order.length > shown.length ? <li className="text-muted-foreground">و {(order.length - shown.length).toLocaleString("fa-IR")} گام دیگر</li> : null}
    </ol>
  );
}
