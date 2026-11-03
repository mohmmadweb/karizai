"use client";

import { GaugeIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getReportNow } from "@/admin/features/usage-report/data/usage-records";
import { formatDateTime, formatNumber } from "@/admin/lib/format";
import { columnVars } from "../lib/columns";
import { useBi, type IndicatorRow } from "./bi-provider";
import { IndicatorCard } from "./indicator-card";

const gridClass = "grid grid-cols-1 gap-4 md:grid-cols-(--cols-md) lg:grid-cols-(--cols-lg) xl:grid-cols-(--cols-xl)";

/** One group of cards. The columns are chosen so that the last row is full. */
function CardGroup({ title, rows }: { title: string; rows: IndicatorRow[] }) {
  if (rows.length === 0) return null;
  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <h2 className="text-h4">{title}</h2>
      <ul className={gridClass} style={columnVars(rows.length)}>
        {rows.map((row) => <li key={row.indicator.id}><IndicatorCard row={row} /></li>)}
      </ul>
    </section>
  );
}

/** Counts of indicators by status in one strip (the out-of-range count leads), then the cards in two groups. */
export function DashboardTab() {
  const { rows } = useBi();
  if (rows.length === 0) {
    return <EmptyState icon={<GaugeIcon aria-hidden />} title="شاخص فعالی نیست" description="در زبانه‌ی «شاخص‌ها» یک شاخص با حد مجاز تعریف یا فعال کنید تا وضعیتش اینجا دیده شود." />;
  }
  const out = rows.filter((row) => row.status === "out");
  const rest = rows.filter((row) => row.status !== "out");
  const near = rows.filter((row) => row.status === "near").length;
  const summary = [
    { label: "خارج از حد", value: out.length, lead: true },
    { label: "نزدیک به حد", value: near },
    { label: "در حد مجاز", value: rows.length - out.length - near },
    { label: "شاخص‌های فعال", value: rows.length },
  ];
  return (
    <div className="flex flex-col gap-6">
      {out.length > 0 ? (
        <Alert variant="destructive">
          <AlertTitle>برای مسئولان این شاخص‌ها هشدار ساخته شده است</AlertTitle>
          <AlertDescription>هشدار در شبکه اجتماعی سازمان به گروه‌ها و کاربران مسئول نمایش داده می‌شود.</AlertDescription>
        </Alert>
      ) : null}
      <div className="flex flex-col gap-2">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
          {summary.map((item) => (
            <li key={item.label} className="flex flex-col justify-between gap-2 bg-card p-4">
              <span className="text-body-sm text-muted-foreground">{item.label}</span>
              <span className={`tabular-nums ${item.lead ? "text-h2" : "text-h4"} ${item.lead && item.value > 0 ? "text-destructive" : item.value === 0 ? "text-muted-foreground" : ""}`}>{formatNumber(item.value)}</span>
            </li>
          ))}
        </ul>
        <p className="text-caption text-muted-foreground">مقدارها در {formatDateTime(getReportNow())} خوانده شده‌اند.</p>
      </div>
      <CardGroup title="خارج از حد" rows={out} />
      <CardGroup title="در حد مجاز و نزدیک به حد" rows={rest} />
    </div>
  );
}
