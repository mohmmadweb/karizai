import type { Indicator, IndicatorStatus } from "../types";

const tone: Record<IndicatorStatus, string> = { ok: "bg-success", near: "bg-warning", out: "bg-destructive" };

/**
 * The allowed range as a green band on a track, with a marker for the current value.
 * The scale runs from the start (right) edge, as Persian is read. An open side runs to the edge.
 */
export function RangeBar({ indicator, value, status }: { indicator: Indicator; value: number; status: IndicatorStatus }) {
  const { lowerLimit: lo, upperLimit: hi } = indicator;
  const anchor = [lo, hi, value].filter((n): n is number => n !== null);
  const min = Math.min(...anchor);
  const max = Math.max(...anchor);
  const pad = Math.max((max - min) * 0.35, Math.abs(max) * 0.05, 0.5);
  const from = min - pad;
  const to = max + pad;
  const pct = (n: number) => ((n - from) / (to - from)) * 100;
  const bandStart = lo === null ? 0 : pct(lo);
  const bandEnd = hi === null ? 100 : pct(hi);
  return (
    <div className="relative h-3 rounded-full bg-muted" role="img" aria-label="جای مقدار فعلی نسبت به حد مجاز">
      <span className="absolute inset-y-0 rounded-full bg-success/30" style={{ insetInlineStart: `${bandStart}%`, width: `${bandEnd - bandStart}%` }} />
      <span className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-card shadow-sm ${tone[status]}`} style={{ insetInlineStart: `calc(${pct(value)}% - 0.5rem)` }} />
    </div>
  );
}
