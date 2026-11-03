import { formatDuration } from "../lib/model-speed";
import type { Timing } from "../types";

/** Median on top, P95 below, both with their unit. */
export function TimingCell({ timing }: { timing: Timing }) {
  return (
    <span className="flex flex-col gap-0.5 tabular-nums">
      <span className="text-foreground">{formatDuration(timing.medianMs)}</span>
      <span className="text-caption text-muted-foreground">صدک ۹۵: {formatDuration(timing.p95Ms)}</span>
    </span>
  );
}
