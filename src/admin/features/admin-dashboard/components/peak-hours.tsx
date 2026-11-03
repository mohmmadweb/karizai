import { TrendChart } from "@/admin/components/shared/trend-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hourLabel } from "@/admin/features/usage-report/lib/format-rows";
import { formatNumber } from "@/admin/lib/format";
import { peakOf } from "../lib/peak";
import type { PeakHour } from "../types";

const HOUR = 3_600_000;

export function PeakHours({ hours }: { hours: PeakHour[] }) {
  const labels = hours.map((h) => hourLabel(h.hour * HOUR));
  const peak = peakOf(hours);
  const peakText = peak
    ? `ساعت اوج: ${hourLabel(peak.hour * HOUR)} تا ${hourLabel(((peak.hour + 1) % 24) * HOUR)} (${formatNumber(peak.requests)} درخواست)`
    : "در این بازه درخواستی ثبت نشده است.";
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>درخواست‌ها در ساعت‌های شبانه‌روز</CardTitle>
          <CardDescription>{peakText}</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart
            labels={labels}
            series={[{ key: "requests", label: "درخواست‌ها", values: hours.map((h) => h.requests), color: "chart-1" }]}
            unit="درخواست"
            ariaLabel="نمودار تعداد درخواست‌ها در هر ساعت شبانه‌روز"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>تأخیر صدک ۹۵ زمان تا اولین کلمه</CardTitle>
          <CardDescription>بر حسب میلی‌ثانیه، در هر ساعت شبانه‌روز.</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart
            labels={labels}
            series={[{ key: "ttft", label: "صدک ۹۵", values: hours.map((h) => h.ttftP95Ms), color: "chart-2" }]}
            unit="میلی‌ثانیه"
            ariaLabel="نمودار تأخیر صدک ۹۵ زمان تا اولین کلمه در هر ساعت شبانه‌روز"
          />
        </CardContent>
      </Card>
    </div>
  );
}
