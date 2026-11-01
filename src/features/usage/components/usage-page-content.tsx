"use client";

import { useState } from "react";
import { ChartNoAxesColumnIcon, TriangleAlertIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuotaBar } from "@/features/chat/components/quota-bar";
import { useChat } from "@/features/chat/components/chat-provider";
import { formatDate, formatNumber } from "@/lib/format";
import { getQuota } from "@/features/user-session/data/session";
import { getUsageReport } from "../data/usage";
import type { UsagePeriod } from "../types";
import { UsageTable } from "./usage-table";

const periods: { value: UsagePeriod; label: string }[] = [
  { value: "daily", label: "روزانه" },
  { value: "weekly", label: "هفتگی" },
  { value: "monthly", label: "ماهانه" },
];

export function UsagePageContent() {
  const { state } = useChat();
  const quota = getQuota();
  const [period, setPeriod] = useState<UsagePeriod>("daily");
  const report = getUsageReport(period);
  const max = Math.max(...report.series.map((point) => point.tokens), 1);
  const nearLimit = state.used / quota.limit >= 0.8;
  const empty = report.series.every((point) => point.requests === 0);

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="مصرف من" description="فقط مصرف خودتان نمایش داده می‌شود." />
      {nearLimit ? (
        <Alert variant="warning">
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>به سقف سهمیه نزدیک شده‌اید</AlertTitle>
          <AlertDescription>{formatNumber(Math.max(quota.limit - state.used, 0))} توکن باقی مانده است و سهمیه در {formatDate(quota.resetsAt)} بازنشانی می‌شود.</AlertDescription>
        </Alert>
      ) : null}
      <section aria-label="سهمیه" className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-body-sm text-muted-foreground">باقی‌مانده‌ی سهمیه</p>
          <p className="flex flex-wrap items-baseline gap-x-2 text-h2 tabular-nums">
            {formatNumber(Math.max(quota.limit - state.used, 0))}
            <span className="text-body-sm text-muted-foreground">توکن از {formatNumber(quota.limit)}</span>
          </p>
        </div>
        <QuotaBar quota={quota} used={state.used} />
        <p className="text-caption text-muted-foreground">بازنشانی سهمیه: {formatDate(quota.resetsAt)}</p>
      </section>
      <Tabs value={period} onValueChange={(value) => setPeriod(value as UsagePeriod)}>
        <TabsList>{periods.map((item) => <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>)}</TabsList>
      </Tabs>
      {empty ? (
        <EmptyState icon={<ChartNoAxesColumnIcon />} title="در این بازه مصرفی نداشته‌اید" />
      ) : (
        <>
          <section className="flex flex-col gap-3" aria-label="روند مصرف">
            <h2 className="text-h4">روند مصرف</h2>
            <ul className="flex flex-col gap-2">
              {report.series.map((point) => (
                <li key={point.label} className="grid grid-cols-[5rem_1fr] items-center gap-3 text-body-sm">
                  <span>{point.label}</span>
                  {/* The value sits right after the end of its bar; the longest bar takes 65 % of the row so the value always fits. */}
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-3 shrink-0 rounded-full bg-primary" style={{ width: `${Math.max((point.tokens / max) * 65, point.tokens > 0 ? 1 : 0)}%` }} role="presentation" />
                    <span className="whitespace-nowrap tabular-nums text-muted-foreground">{formatNumber(point.requests)} درخواست · {formatNumber(point.tokens)} توکن</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <div className="grid gap-8 lg:grid-cols-2">
            <UsageTable title="به تفکیک مدل" rows={report.byModel} />
            <UsageTable title="به تفکیک Agent" rows={report.byAgent} />
          </div>
        </>
      )}
    </div>
  );
}
