"use client";

import { useState } from "react";
import { TrendChart } from "@/admin/components/shared/trend-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hourLabel, shortDayLabel } from "../lib/format-rows";
import type { Bucket, Metric, ResolvedPeriod } from "../types";

type Props = { buckets: Bucket[]; range: ResolvedPeriod };

export function TrendSection({ buckets, range }: Props) {
  const [metric, setMetric] = useState<Metric>("requests");
  const labels = buckets.map((b) => (range.bucket === "hour" ? hourLabel(b.start) : shortDayLabel(b.start)));
  const unit = metric === "requests" ? "درخواست" : "توکن";
  const series =
    metric === "requests"
      ? [{ key: "requests", label: "درخواست‌ها", values: buckets.map((b) => b.requests), color: "chart-1" as const }]
      : [
          { key: "in", label: "ورودی", values: buckets.map((b) => b.inputTokens), color: "chart-1" as const },
          { key: "out", label: "خروجی", values: buckets.map((b) => b.outputTokens), color: "chart-2" as const },
        ];

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle>روند مصرف</CardTitle>
        <div role="group" aria-label="نمایش بر اساس" className="flex gap-2">
          {(["requests", "tokens"] as const).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={metric === m ? "default" : "outline"}
              aria-pressed={metric === m}
              onClick={() => setMetric(m)}
            >
              {m === "requests" ? "درخواست‌ها" : "توکن‌ها"}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <TrendChart
          labels={labels}
          series={series}
          unit={unit}
          ariaLabel={`نمودار روند ${unit} ${range.bucket === "hour" ? "ساعت‌به‌ساعت" : "روزبه‌روز"}`}
        />
      </CardContent>
    </Card>
  );
}
