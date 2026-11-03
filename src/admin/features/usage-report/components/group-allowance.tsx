import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/admin/lib/format";
import { stateLabels, type AllowanceLine, type AllowanceState } from "../lib/allowance";

const variant: Record<AllowanceState, "success" | "warning" | "destructive" | "secondary"> = {
  within: "success",
  near: "warning",
  used: "destructive",
  none: "secondary",
  unpriced: "secondary",
};

const toman = (value: number | null) => (value === null ? "—" : `${formatNumber(Math.round(value))} تومان`);

/** Weekly ceiling, spending and what is left for every active group. */
export function GroupAllowance({ lines }: { lines: AllowanceLine[] }) {
  return (
    <ul className="flex flex-col divide-y rounded-xl border bg-card">
      {lines.map((line) => (
        <li key={line.groupId} className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-label text-foreground">{line.name}</span>
            <Badge variant={variant[line.state]}>{stateLabels[line.state]}</Badge>
          </div>
          {line.limit === null ? (
            <p className="text-body-sm text-muted-foreground">مصرف این هفته: {toman(line.used)}</p>
          ) : (
            <>
              <Progress value={line.percent} aria-label={`مصرف هفتگی ${line.name}`} className="gap-0">
                {null}
              </Progress>
              <dl className="grid grid-cols-1 gap-2 text-body-sm sm:grid-cols-3">
                <div><dt className="text-muted-foreground">سقف هفتگی</dt><dd className="tabular-nums">{toman(line.limit)}</dd></div>
                <div><dt className="text-muted-foreground">مصرف این هفته</dt><dd className="tabular-nums">{toman(line.used)}</dd></div>
                <div><dt className="text-muted-foreground">باقی‌مانده</dt><dd className="tabular-nums">{toman(line.remaining)}</dd></div>
              </dl>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
