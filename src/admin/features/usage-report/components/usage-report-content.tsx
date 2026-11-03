"use client";

import { useMemo, useState } from "react";
import { DownloadIcon, SearchXIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { getReportNow, getUsageRecords } from "../data/usage-records";
import {
  bindToModels,
  buckets as bucketize,
  filterRows,
  inRange,
  rowsByGroup,
  rowsByModel,
  recordsForRow,
  rowsByUser,
  summarize,
} from "../lib/aggregate";
import { buildCsv, downloadCsv } from "../lib/export-csv";
import { plainCost } from "../lib/format-rows";
import { resolvePeriod } from "../lib/periods";
import { rowsFromBuckets, totalRow, viewLabels } from "../lib/rows";
import { hasRangeErrors, validateRange } from "../lib/validation";
import { dayLabel } from "../lib/format-rows";
import type { CustomRange, PeriodId, ReportView, ResolvedPeriod, UsageRow } from "../types";
import { BreakdownTable } from "./breakdown-table";
import { UsageDetailsDialog } from "./usage-details-dialog";
import { PeriodPicker } from "./period-picker";
import { SummaryCards } from "./summary-cards";
import { TrendSection } from "./trend-section";

const now = getReportNow();
const views = Object.keys(viewLabels) as ReportView[];
const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function UsageReportContent() {
  const { users, groups, memberships } = useDirectory();
  const { models, providers } = useModels();
  const [period, setPeriod] = useState<PeriodId>("month");
  const [view, setView] = useState<ReportView>("system");
  const [range, setRange] = useState<CustomRange>({ from: "", to: "" });
  const [touched, setTouched] = useState(false);
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<{ view: ReportView; row: UsageRow } | null>(null);
  const [applied, setApplied] = useState<ResolvedPeriod>(() => resolvePeriod("month", range, now)!);

  const errors = touched && period === "custom" ? validateRange(range) : {};

  function changePeriod(next: PeriodId) {
    setPeriod(next);
    if (next !== "custom") setApplied(resolvePeriod(next, range, now)!);
    else if (!hasRangeErrors(validateRange(range))) {
      const r = resolvePeriod("custom", range, now);
      if (r) setApplied(r);
    }
  }

  function changeRange(next: CustomRange) {
    setRange(next);
    setTouched(true);
    const r = hasRangeErrors(validateRange(next)) ? null : resolvePeriod("custom", next, now);
    if (r) setApplied(r);
  }

  const report = useMemo(() => {
    const records = inRange(bindToModels(getUsageRecords(), models), applied);
    const ctx = { users, groups, memberships, models, providers };
    const { totals, unpricedModelIds } = summarize(records, models);
    const buckets = bucketize(records, applied, models);
    const rows =
      view === "system"
        ? rowsFromBuckets(buckets, applied)
        : view === "user"
          ? rowsByUser(records, ctx)
          : rowsByGroup(records, ctx);
    return { records, totals, unpricedModelIds, buckets, rows };
  }, [applied, view, users, groups, memberships, models, providers]);

  const detailData = useMemo(() => {
    if (!detail) return null;
    const ctx = { users, groups, memberships, models, providers };
    const records = recordsForRow(detail.view, detail.row.id, report.records, ctx, applied);
    return { totals: summarize(records, models).totals, models: rowsByModel(records, ctx) };
  }, [detail, report.records, applied, users, groups, memberships, models, providers]);
  const periodText = `${dayLabel(applied.from)} تا ${dayLabel(applied.to - 1)}`;

  const rows = view === "system" ? report.rows : filterRows(report.rows, query);
  const empty = report.records.length === 0;

  function exportRows() {
    const withTotal = view === "system" ? [...rows, totalRow(report.totals)] : rows;
    const csv = buildCsv(withTotal, [
      { header: view === "system" ? "دوره" : viewLabels[view], value: (r) => r.name },
      { header: "درخواست‌ها", value: (r) => r.requests },
      { header: "توکن ورودی", value: (r) => r.inputTokens },
      { header: "توکن خروجی", value: (r) => r.outputTokens },
      { header: "هزینه‌ی تقریبی (تومان)", value: (r) => plainCost(r) },
    ]);
    const name = `گزارش-مصرف-${viewLabels[view]}-${isoDay(applied.from)}-${isoDay(applied.to - 1)}.csv`;
    downloadCsv(csv, name.replace(/\s+/g, "-"));
    toast.success("خروجی آماده شد.");
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="گزارش مصرف"
        description="مصرف درخواست و توکن را در بازه‌ی دلخواه به تفکیک کل سیستم، کاربر و گروه ببینید؛ مصرف هر مدل در صفحه‌ی مدل‌های هر ارائه‌دهنده است."
      />
      <div className="flex flex-col gap-5">
        <PeriodPicker
          period={period}
          onPeriodChange={changePeriod}
          range={range}
          errors={errors}
          onRangeChange={changeRange}
        />
        <Tabs value={view} onValueChange={(v) => setView(v as ReportView)}>
          <TabsList aria-label="تفکیک گزارش">
            {views.map((v) => (
              <TabsTrigger key={v} value={v}>
                {viewLabels[v]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <SummaryCards totals={report.totals} />
      {empty ? (
        <EmptyState
          icon={<SearchXIcon />}
          title="در این بازه مصرفی ثبت نشده"
          description="بازه‌ی دیگری را امتحان کنید."
        />
      ) : (
        <>
          <TrendSection buckets={report.buckets} range={applied} />
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {view === "system" ? <span /> : (
                <SearchField
                  label={`جست‌وجوی ${viewLabels[view]}`}
                  placeholder="جست‌وجو بر اساس نام"
                  value={query}
                  onValueChange={setQuery}
                />
              )}
              <Button variant="outline" disabled={rows.length === 0} onClick={exportRows}>
                <DownloadIcon aria-hidden />
                خروجی Excel
              </Button>
            </div>
            {rows.length === 0 ? (
              <EmptyState
                icon={<SearchXIcon />}
                title="موردی پیدا نشد"
                description="نام دیگری را امتحان کنید."
                action={<Button variant="outline" onClick={() => setQuery("")}>پاک‌کردن جست‌وجو</Button>}
              />
            ) : (
              <BreakdownTable
                view={view}
                rows={rows}
                total={view === "system" ? totalRow(report.totals) : undefined}
                unpricedCount={report.unpricedModelIds.length}
                onDetails={(row) => setDetail({ view, row })}
              />
            )}
          </div>
        </>
      )}
      <UsageDetailsDialog
        open={detail !== null}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        title={detail?.row.name ?? ""}
        subtitle={detail?.view === "system" ? "مصرف همه‌ی کاربران در این دوره" : periodText}
        totals={detailData?.totals ?? { requests: 0, inputTokens: 0, outputTokens: 0, cost: null }}
        models={detailData?.models ?? []}
      />
    </div>
  );
}
