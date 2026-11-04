import { formatNumber } from "@/admin/lib/format";
import { cn } from "@/lib/utils";
import { getUptimeHistory, SLA_TARGET } from "../data/status";

const pct = (v: number) => `${formatNumber(v, { maximumFractionDigits: 2 })}٪`;

/**
 * Twelve monthly bars on a 99–100٪ scale, with the SLA target line.
 * The list is oldest first, so in RTL the oldest month sits at the right and the newest at the left.
 */
export function UptimeHistory() {
  const history = getUptimeHistory();
  const height = (v: number) => `${Math.max(4, (v - 99) * 100)}%`;
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 text-caption text-muted-foreground">
        <span className="w-6 border-t border-dashed border-destructive" aria-hidden />
        هدف SLA: <span className="tabular-nums text-foreground">{pct(SLA_TARGET)}</span>
      </p>
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-[32rem] flex-col gap-2">
          <div className="relative flex h-40 items-end gap-1.5 border-b border-border" role="list" aria-label="دسترس‌پذیری ماهانه">
            <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-destructive/60" style={{ bottom: height(SLA_TARGET) }} aria-hidden />
            {history.map((h) => (
              <div key={h.month} role="listitem" aria-label={`${h.month}: ${pct(h.uptime)}`} title={`${h.month}: ${pct(h.uptime)}`} className="flex h-full flex-1 items-end">
                <div className={cn("w-full rounded-t-sm", h.uptime >= SLA_TARGET ? "bg-chart-1" : "bg-destructive")} style={{ height: height(h.uptime) }} />
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 text-caption text-muted-foreground">
            {history.map((h) => (
              <span key={h.month} className="flex min-w-0 flex-1 flex-col items-center text-center leading-tight">
                <span>{h.month}</span>
                <span className="tabular-nums text-foreground">{formatNumber(h.uptime, { maximumFractionDigits: 2 })}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
