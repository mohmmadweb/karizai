"use client";

import { useMemo, useState } from "react";
import { DownloadIcon, SearchXIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { usePolicies } from "@/admin/features/policies/components/policies-provider";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { getReportNow, getUsageRecords } from "../data/usage-records";
import {
  bindToModels,
  buckets as bucketize,
  filterRows,
  inRange,
  rowsByAgent,
  rowsByGroup,
  rowsByModel,
  recordsForRow,
  rowsByUser,
  summarize,
} from "../lib/aggregate";
import { buildAllowances } from "../lib/allowance";
import { buildCsv, downloadCsv } from "../lib/export-csv";
import { plainCost } from "../lib/format-rows";
import { buildShare } from "../lib/group-share";
import { resolvePeriod } from "../lib/periods";
import { rowsFromBuckets, totalRow, viewLabels } from "../lib/rows";
import { hasRangeErrors, validateRange } from "../lib/validation";
import { dayLabel } from "../lib/format-rows";
import type { CustomRange, PeriodId, ReportView, ResolvedPeriod, UsageRow } from "../types";
import { BreakdownTable } from "./breakdown-table";
import { GroupAllowance } from "./group-allowance";
import { GroupShareChart } from "./group-share-chart";
import { UsageDetailsDialog } from "./usage-details-dialog";
import { PeriodPicker } from "./period-picker";
import { UsageBlock } from "./usage-block";
import { SummaryCards } from "./summary-cards";
import { TopConsumers } from "./top-consumers";
import { TrendSection } from "./trend-section";

const now = getReportNow();
const views = Object.keys(viewLabels) as ReportView[];
const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function UsageOverview() {
  const { users, groups, memberships } = useDirectory();
  const { models, providers } = useModels();
  const { policies } = usePolicies();
  const [period, setPeriod] = useState<PeriodId>("month");
  const [view, setView] = useState<ReportView>("system");
  const [range, setRange] = useState<CustomRange>({ from: new Date(Date.parse(now) - 6 * 86_400_000).toISOString().slice(0, 10), to: now.slice(0, 10) });
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
          : view === "agent"
            ? rowsByAgent(records, ctx)
            : rowsByGroup(records, ctx);
    const groupRows = rowsByGroup(records, ctx);
    const weekRecords = inRange(bindToModels(getUsageRecords(), models), resolvePeriod("week", { from: "", to: "" }, now)!);
    const share = buildShare(groupRows);
    const multiGroup = new Set(memberships.map((m) => m.userId)).size < memberships.length;
    const allowances = buildAllowances(groups, rowsByGroup(weekRecords, ctx), policies.weeklyLimits);
    const top = { users: view === "user" ? rows : rowsByUser(records, ctx), agents: view === "agent" ? rows : rowsByAgent(records, ctx) };
    return { records, totals, unpricedModelIds, buckets, rows, share, multiGroup, allowances, top };
  }, [applied, view, users, groups, memberships, models, providers, policies.weeklyLimits]);

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
          <UsageBlock title="سهم گروه‌ها از مصرف" description="سهم هر گروه از توکن‌های بازه‌ی انتخاب‌شده.">
            <GroupShareChart slices={report.share.slices} all={report.share.all} multiGroupNote={report.multiGroup} />
          </UsageBlock>
          <UsageBlock title="سقف هفتگی و باقی‌مانده‌ی گروه‌ها" description="همیشه برای هفته‌ی جاری است، حتی اگر بازه‌ی دیگری انتخاب شده باشد.">
            <GroupAllowance lines={report.allowances} />
          </UsageBlock>
          <UsageBlock title="پرمصرف‌ترین‌ها" description="کاربران و عامل‌هایی که در بازه‌ی انتخاب‌شده بیشترین توکن را مصرف کرده‌اند.">
            <TopConsumers users={report.top.users} agents={report.top.agents} />
          </UsageBlock>
          <div id="usage-table" tabIndex={-1} className="flex scroll-mt-20 flex-col gap-4 outline-none">
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
