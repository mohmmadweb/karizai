"use client";

import { useState } from "react";
import { CircleCheckIcon, DownloadIcon, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { buildCsv, downloadCsv } from "@/admin/features/usage-report/lib/export-csv";
import { formatNumber } from "@/admin/lib/format";
import { budgetMonth, exhaustedByGroup, exhaustedLabels, getUserLimits, type UserLimit } from "../data/user-limits";
import { forecast, spentOf, toman } from "../lib/forecast";
import { GroupBudgets } from "./group-budgets";
import { LimitDialog } from "./limit-dialog";
import { MeterBar } from "./meter-bar";

type Row = UserLimit & { spent: number; monthEnd: number; exhaustDay: number | null; groupName: string; policy: string };

/** Monthly limits per person in toman with a month-end forecast; group budgets come from the policy center. */
export function BudgetsPageContent() {
  const { groups } = useDirectory();
  const [limits, setLimits] = useState(getUserLimits);
  const [editing, setEditing] = useState<UserLimit | null>(null);

  const rows: Row[] = limits.map((u) => {
    const spent = spentOf(u);
    const policy = exhaustedLabels[exhaustedByGroup[u.groupId] ?? "lock"];
    return { ...u, spent, ...forecast(spent, u.monthlyToman), groupName: groups.find((g) => g.id === u.groupId)?.name ?? "—", policy };
  });
  const total = rows.reduce((s, r) => ({ limit: s.limit + r.monthlyToman, spent: s.spent + r.spent, end: s.end + r.monthEnd }), { limit: 0, spent: 0, end: 0 });
  const atRisk = rows.filter((r) => r.exhaustDay !== null).length;

  function exportCsv() {
    const csv = buildCsv(rows, [
      { header: "کاربر", value: (r) => r.name },
      { header: "گروه", value: (r) => r.groupName },
      { header: "سقف ماهانه (تومان)", value: (r) => r.monthlyToman },
      { header: "مصرف تا امروز (تومان)", value: (r) => r.spent },
      { header: "پیش‌بینی پایان ماه (تومان)", value: (r) => r.monthEnd },
      { header: "رفتار پس از اتمام", value: (r) => r.policy },
    ]);
    downloadCsv(csv, `بودجه-و-سهمیه-${budgetMonth.label.replace(/\s+/g, "-")}.csv`);
    toast.success("خروجی Excel ساخته شد.");
  }

  const columns: DataTableColumn<Row>[] = [
    { id: "name", header: "کاربر", cell: (r) => <span className="flex flex-col"><span className="font-medium">{r.name}</span><span className="text-caption text-muted-foreground">{r.groupName}</span></span> },
    { id: "limit", header: "سقف ماهانه", align: "end", cell: (r) => toman(r.monthlyToman) },
    {
      id: "usage",
      header: "مصرف تا امروز",
      cell: (r) => (
        <span className="flex min-w-36 flex-col gap-1">
          <MeterBar value={r.spent} max={r.monthlyToman} label={`مصرف ${r.name}`} />
          <span className="text-caption tabular-nums text-muted-foreground">{toman(r.spent)} · {formatNumber(Math.round((r.spent / r.monthlyToman) * 100))}٪</span>
        </span>
      ),
    },
    {
      id: "forecast",
      header: "پیش‌بینی پایان ماه",
      cell: (r) => (
        <span className="flex flex-col items-start gap-1">
          <span className="tabular-nums">{toman(r.monthEnd)}</span>
          {r.exhaustDay !== null ? <Badge variant="warning">تمام می‌شود حدود روز {formatNumber(r.exhaustDay)}</Badge> : <Badge variant="success">کافی است</Badge>}
        </span>
      ),
    },
    { id: "policy", header: "پس از اتمام", hideBelow: "lg", className: "text-muted-foreground", cell: (r) => r.policy },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="بودجه و سهمیه"
        description={`سقف ماهانه‌ی هر نفر به تومان و پیش‌بینی پایان ماه (${budgetMonth.label}، ${formatNumber(budgetMonth.daysPassed)} روز از ${formatNumber(budgetMonth.daysInMonth)} روز گذشته).`}
        action={<Button variant="outline" onClick={exportCsv}><DownloadIcon aria-hidden />خروجی Excel</Button>}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success"><CircleCheckIcon aria-hidden />تطبیق با صورت‌حساب ارائه‌دهنده: بدون مغایرت</Badge>
        <span className="text-caption text-muted-foreground">نرخ: هر هزار توکن مدل داخلی ۴۰ و مدل بیرونی ۹۰۰ تومان</span>
      </div>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
        {[
          ["سقف کل ماه", toman(total.limit)],
          ["مصرف تا امروز", toman(total.spent)],
          ["پیش‌بینی پایان ماه", toman(total.end)],
          ["افراد در خطر اتمام", formatNumber(atRisk)],
        ].map(([label, value]) => (
          <li key={label} className="flex flex-col gap-2 bg-card p-4">
            <span className="text-body-sm text-muted-foreground">{label}</span>
            <span className="text-h4 tabular-nums">{value}</span>
          </li>
        ))}
      </ul>
      <GroupBudgets />
      <section className="flex flex-col gap-3" aria-label="سقف ماهانه‌ی افراد">
        <h2 className="text-h3">سقف ماهانه‌ی افراد</h2>
        <DataTable
          label="سقف ماهانه‌ی افراد"
          rows={rows}
          columns={columns}
          getRowId={(r) => r.id}
          getRowLabel={(r) => `سقف ${r.name}`}
          getRowActions={(r) => [[{ label: "ویرایش سقف", icon: <PencilIcon aria-hidden />, inline: true, onSelect: () => setEditing(r) }]]}
          hidePagerWhenSingle
        />
      </section>
      <LimitDialog
        user={editing}
        onOpenChange={(open) => { if (!open) setEditing(null); }}
        onSave={(id, monthlyToman) => { setLimits((list) => list.map((u) => (u.id === id ? { ...u, monthlyToman } : u))); toast.success("سقف ماهانه ذخیره شد."); }}
      />
    </div>
  );
}
