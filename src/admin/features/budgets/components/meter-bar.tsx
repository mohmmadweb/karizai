import { cn } from "@/lib/utils";

type Props = { value: number; max: number; label: string; warnAt?: number; className?: string };

/** A thin usage bar; it turns warning and then destructive near and past the limit, always with a number beside it. */
export function MeterBar({ value, max, label, warnAt = 0.8, className }: Props) {
  const share = max > 0 ? value / max : 0;
  const tone = share >= 1 ? "bg-destructive" : share >= warnAt ? "bg-warning" : "bg-primary";
  return (
    <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.round(value)} className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full transition-all duration-300", tone)} style={{ width: `${Math.min(100, share * 100)}%` }} />
    </div>
  );
}
