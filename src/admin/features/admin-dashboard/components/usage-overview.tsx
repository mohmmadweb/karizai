"use client";

import { useMemo, useState } from "react";
import { TrendChart } from "@/admin/components/shared/trend-chart";
import { FilterSelect } from "@/admin/features/audit/components/filter-select";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { getReportNow, getUsageRecords } from "@/admin/features/usage-report/data/usage-records";
import { bindToModels, inRange } from "@/admin/features/usage-report/lib/aggregate";
import { hourLabel, shortDayLabel } from "@/admin/features/usage-report/lib/format-rows";
import { resolvePeriod } from "@/admin/features/usage-report/lib/periods";
import type { PeriodId } from "@/admin/features/usage-report/types";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { formatNumber } from "@/admin/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePolicies } from "@/lib/policy-store";
import { buildOverview, remainingOf, type OverviewRow } from "../lib/overview";
import { DashboardSection } from "./dashboard-section";
import { DonutChart } from "./donut-chart";

const now = getReportNow();
const periods: { id: Exclude<PeriodId, "custom">; label: string }[] = [
  { id: "today", label: "امروز" },
  { id: "week", label: "هفته" },
  { id: "month", label: "ماه" },
];
const toman = (v: number) => `${formatNumber(Math.round(v))} تومان`;

function RankList({ title, rows }: { title: string; rows: OverviewRow[] }) {
  const max = Math.max(1, ...rows.map((r) => r.toman));
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {rows.length === 0 ? <p className="text-body-sm text-muted-foreground">مصرفی ثبت نشده.</p> : (
          <ol className="flex flex-col gap-3">
            {rows.map((r) => (
              <li key={r.id} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-3 text-body-sm">
                  <span className="min-w-0 truncate text-foreground">{r.name}</span>
                  <span className="shrink-0 text-muted-foreground tabular-nums">{toman(r.toman)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(r.toman / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

/** Cost and consumption per group, remaining budgets, top users and agents, and the trend. */
export function UsageOverview() {
  const { users, groups, memberships } = useDirectory();
  const { models } = useModels();
  const { budgets } = usePolicies();
  const [period, setPeriod] = useState<Exclude<PeriodId, "custom">>("month");
  const [userId, setUserId] = useState("all");
  const [groupId, setGroupId] = useState("all");

  const range = useMemo(() => resolvePeriod(period, { from: "", to: "" }, now)!, [period]);
  const view = useMemo(() => {
    const records = inRange(bindToModels(getUsageRecords(), models), range);
    return buildOverview(records, { users, groups, memberships, models }, range, { userId, groupId });
  }, [range, models, users, groups, memberships, userId, groupId]);

  const userOptions = [{ value: "all", label: "همه‌ی کاربران" }, ...users.map((u) => ({ value: u.id, label: u.name }))];
  const groupOptions = [{ value: "all", label: "همه‌ی گروه‌ها" }, ...groups.map((g) => ({ value: g.id, label: g.name }))];
  const shownBudgets = budgets.filter((b) => groupId === "all" || b.groupId === groupId);
  const labels = view.buckets.map((b) => (range.bucket === "hour" ? hourLabel(b.start) : shortDayLabel(b.start)));
  const figures = [
    { label: "هزینه‌ی دوره", value: toman(view.toman) },
    { label: "توکن مصرفی", value: formatNumber(view.tokens) },
    { label: "درخواست‌ها", value: formatNumber(view.requests) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end gap-4">
        <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
          <TabsList aria-label="بازه‌ی زمانی">
            {periods.map((p) => <TabsTrigger key={p.id} value={p.id}>{p.label}</TabsTrigger>)}
          </TabsList>
        </Tabs>
        <FilterSelect id="overview-user" label="کاربر" value={userId} options={userOptions} onValueChange={setUserId} />
        <FilterSelect id="overview-group" label="گروه" value={groupId} options={groupOptions} onValueChange={setGroupId} />
      </div>
      <ul className="grid gap-4 sm:grid-cols-3">
        {figures.map((f) => (
          <li key={f.label}>
            <Card className="h-full">
              <CardHeader><CardTitle className="text-body-sm font-normal text-muted-foreground">{f.label}</CardTitle></CardHeader>
              <CardContent><p className="text-h3 text-foreground tabular-nums">{f.value}</p></CardContent>
            </Card>
          </li>
        ))}
      </ul>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>سهم هر گروه از هزینه</CardTitle></CardHeader>
          <CardContent>
            <DonutChart
              slices={view.byGroup.map((g) => ({ id: g.id, label: g.name, value: g.toman }))}
              unit="تومان" centerLabel="کل هزینه" ariaLabel="نمودار دایره‌ای سهم گروه‌ها از هزینه‌ی مصرف"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>سهمیه‌ی این هفته</CardTitle></CardHeader>
          <CardContent>
            {shownBudgets.length === 0 ? <p className="text-body-sm text-muted-foreground">برای این گروه بودجه‌ای تعریف نشده.</p> : (
              <ul className="flex flex-col gap-5">
                {shownBudgets.map((b) => {
                  const left = remainingOf(b);
                  return (
                    <li key={b.groupId} className="flex flex-col gap-1">
                      <Progress value={left.spentFraction * 100}>
                        <ProgressLabel>{b.groupName}</ProgressLabel>
                        <ProgressValue>{() => `${formatNumber(Math.round(left.spentFraction * 100))}٪ مصرف‌شده`}</ProgressValue>
                      </Progress>
                      <p className="text-caption text-muted-foreground">
                        باقی‌مانده: {toman(left.toman)} (حدود {formatNumber(left.tokens)} توکن مدل بیرونی) از {toman(b.weeklyToman)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <RankList title="پرمصرف‌ترین کاربران" rows={view.topUsers} />
        <RankList title="پرمصرف‌ترین عامل‌ها" rows={view.topAgents} />
      </div>
      <Card>
        <CardHeader><CardTitle>روند هزینه (تومان)</CardTitle></CardHeader>
        <CardContent>
          <TrendChart
            labels={labels} unit="تومان" ariaLabel="نمودار روند هزینه‌ی مصرف"
            series={[{ key: "toman", label: "هزینه", values: view.buckets.map((b) => Math.round(b.toman)), color: "chart-1" }]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
