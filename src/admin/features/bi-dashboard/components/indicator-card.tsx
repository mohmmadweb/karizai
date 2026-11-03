"use client";

import { BellRingIcon, CircleCheckIcon, OctagonAlertIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/admin/lib/format";
import { limitsText, statusLabels } from "../lib/series";
import type { IndicatorStatus } from "../types";
import { useBi, type IndicatorRow } from "./bi-provider";
import { RangeBar } from "./range-bar";
import { Sparkline } from "./sparkline";

const badge: Record<IndicatorStatus, { variant: "success" | "warning" | "destructive"; icon: typeof CircleCheckIcon }> = {
  ok: { variant: "success", icon: CircleCheckIcon },
  near: { variant: "warning", icon: TriangleAlertIcon },
  out: { variant: "destructive", icon: OctagonAlertIcon },
};

/** One indicator: current value, allowed range, last 24 hours, and who is told when it leaves the range. */
export function IndicatorCard({ row }: { row: IndicatorRow }) {
  const { sendAlarm } = useBi();
  const { indicator, reading, status, breach, recipients } = row;
  const { variant, icon: Icon } = badge[status];

  function send() {
    const names = sendAlarm(indicator.id);
    toast.success(names.length ? `هشدار برای ${names.join("، ")} در شبکه اجتماعی سازمان ارسال شد.` : "هشدار ثبت شد.");
  }

  return (
    <Card className={`h-full ${status === "out" ? "ring-2 ring-destructive/40" : ""}`}>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle title={indicator.name} className="min-h-14 min-w-0 flex-1 line-clamp-2 text-body font-semibold">{indicator.name}</CardTitle>
          <Badge variant={variant}><Icon aria-hidden />{statusLabels[status]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-h2 tabular-nums">{formatNumber(reading.current, { maximumFractionDigits: 2 })}</p>
          <span className="text-body-sm text-muted-foreground">{indicator.unit}</span>
          {breach ? <span className="text-body-sm font-medium text-destructive">{breach}</span> : null}
        </div>
        <RangeBar indicator={indicator} value={reading.current} status={status} />
        <p className="text-body-sm text-muted-foreground">حد مجاز: {limitsText(indicator)}</p>
        <Sparkline indicator={indicator} series={reading.series} />
        <p className="break-words text-caption text-muted-foreground">
          {recipients.length ? `مسئولان: ${recipients.join("، ")}` : "مسئولی تعیین نشده است."}
          {indicator.source === "manual" ? " · ورود دستی" : ` · خواندن هر ${formatNumber(indicator.refreshMinutes)} دقیقه`}
        </p>
        {status === "out" ? <Button variant="outline" onClick={send}><BellRingIcon aria-hidden />ارسال هشدار</Button> : null}
      </CardContent>
    </Card>
  );
}
