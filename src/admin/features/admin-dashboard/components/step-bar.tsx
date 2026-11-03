import { formatNumber } from "@/admin/lib/format";
import { cn } from "@/lib/utils";
import type { AgentStep, StepKind } from "../types";

export const kindLabels: Record<StepKind, string> = {
  model: "فراخوانی مدل",
  tool: "ابزار",
  api: "API",
  warehouse: "انبار داده",
  documents: "بازیابی اسناد",
};

const kindColor: Record<StepKind, string> = {
  model: "bg-chart-1",
  tool: "bg-chart-2",
  api: "bg-chart-3",
  warehouse: "bg-chart-4",
  documents: "bg-chart-5",
};

export const totalMs = (steps: AgentStep[]) => steps.reduce((sum, s) => sum + s.ms, 0);
export const bottleneckOf = (steps: AgentStep[]) => steps.reduce((a, b) => (b.ms > a.ms ? b : a));
export const shareOf = (step: AgentStep, steps: AgentStep[]) => Math.round((step.ms / totalMs(steps)) * 100);

/** Segments are decoration; the legend under the bar carries every name and share as text. */
export function StepBar({ steps, className }: { steps: AgentStep[]; className?: string }) {
  const total = totalMs(steps);
  return (
    <div aria-hidden className={cn("flex h-3 w-full overflow-hidden rounded-full bg-muted", className)}>
      {steps.map((s) => (
        <div key={s.id} className={cn("h-full border-e border-background last:border-e-0", kindColor[s.kind])} style={{ width: `${(s.ms / total) * 100}%` }} title={`${s.name}: ${formatNumber(shareOf(s, steps))}٪`} />
      ))}
    </div>
  );
}

export function StepLegend({ steps }: { steps: AgentStep[] }) {
  const bottleneck = bottleneckOf(steps);
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
      {steps.map((s) => (
        <li key={s.id} className="flex items-center gap-1.5">
          <span aria-hidden className={cn("size-2.5 shrink-0 rounded-sm", kindColor[s.kind])} />
          <span className="text-foreground">{s.name}</span>
          <span className="tabular-nums">{formatNumber(shareOf(s, steps))}٪</span>
          {s.id === bottleneck.id ? <span className="font-medium text-destructive">گلوگاه</span> : null}
        </li>
      ))}
    </ul>
  );
}
