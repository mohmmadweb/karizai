import { ArrowDownIcon, ArrowUpIcon, CircleCheckIcon, OctagonAlertIcon, PencilIcon, PlugIcon, TriangleAlertIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/admin/lib/format";
import { areaStatus, kpiStatus, kpiValue, seriesOf, weeklyChange } from "../lib/areas";
import { statusLabels } from "../lib/series";
import type { AreaKpi, BusinessArea, IndicatorStatus } from "../types";
import { AreaSparkline } from "./area-sparkline";

const badge: Record<IndicatorStatus, { variant: "success" | "warning" | "destructive"; icon: typeof CircleCheckIcon }> = {
  ok: { variant: "success", icon: CircleCheckIcon },
  near: { variant: "warning", icon: TriangleAlertIcon },
  out: { variant: "destructive", icon: OctagonAlertIcon },
};
const dot: Record<IndicatorStatus, string> = { ok: "bg-success", near: "bg-warning", out: "bg-destructive" };
const num = (n: number | null) => (n === null ? "—" : formatNumber(n, { maximumFractionDigits: 2 }));

/** Where the figure comes from, as one short line: connection, tool and formula. */
const sourceLine = (kpi: AreaKpi) => `${kpi.source.connection} › ${kpi.source.tool}`;

/** One business area: the headline figure with its weekly trend, and two more figures. */
export function AreaCard({ area, onEdit }: { area: BusinessArea; onEdit: (kpi: AreaKpi) => void }) {
  const status = areaStatus(area);
  const { variant, icon: StatusIcon } = badge[status];
  const [head, ...rest] = area.kpis;
  const change = weeklyChange(head);
  const Icon = area.icon;
  return (
    <Card className={`h-full ${status === "out" ? "ring-2 ring-destructive/40" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex min-w-0 items-center gap-2 text-body font-semibold">
            <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate">{area.title}</span>
          </CardTitle>
          <Badge variant={variant}><StatusIcon aria-hidden />{statusLabels[status]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-body-sm text-muted-foreground">{head.label}</p>
            <Button variant="ghost" size="icon-sm" aria-label={`ویرایش شاخص ${head.label}`} onClick={() => onEdit(head)}><PencilIcon aria-hidden /></Button>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-h2 tabular-nums">{num(kpiValue(head))}</span>
            <span className="text-body-sm text-muted-foreground">{head.unit}</span>
            {change && change.delta !== 0 ? (
              <span className={`inline-flex items-center gap-0.5 text-body-sm font-medium ${change.good ? "text-success" : "text-destructive"}`}>
                {change.delta > 0 ? <ArrowUpIcon className="size-3.5" aria-hidden /> : <ArrowDownIcon className="size-3.5" aria-hidden />}
                {num(Math.abs(change.delta))}
              </span>
            ) : null}
          </div>
          <p className="text-caption text-muted-foreground">هدف: {num(head.target)} {head.unit} · {head.better === "higher" ? "بالاتر بهتر است" : "پایین‌تر بهتر است"}</p>
        </div>
        <p className="flex items-center gap-1.5 text-caption text-muted-foreground" title={`فرمول: ${head.source.formula}`}><PlugIcon className="size-3.5 shrink-0" aria-hidden /><span className="truncate">{sourceLine(head)}</span></p>
        {seriesOf(head) ? <AreaSparkline series={seriesOf(head)!} target={head.target} label={`روند ۱۲ هفته‌ی اخیر: ${head.label}`} /> : null}
        <ul className="flex flex-col divide-y divide-border border-t border-border">
          {rest.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2 text-body-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className={`size-2 shrink-0 rounded-full ${dot[kpiStatus(item)]}`} aria-hidden />
                <span className="truncate text-muted-foreground" title={item.label}>{item.label}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1">
                <span className="tabular-nums">{num(kpiValue(item))} <span className="text-caption text-muted-foreground">{item.unit}</span></span>
                <Button variant="ghost" size="icon-sm" aria-label={`ویرایش شاخص ${item.label}`} title={sourceLine(item)} onClick={() => onEdit(item)}><PencilIcon aria-hidden /></Button>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
