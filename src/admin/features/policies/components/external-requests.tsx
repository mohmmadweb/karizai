"use client";

import { useMemo, useState } from "react";
import { SearchXIcon } from "lucide-react";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { formatDateTime, formatNumber } from "@/admin/lib/format";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchField } from "@/components/shared/search-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterSelect, optionsOf } from "@/admin/features/audit/components/filter-select";
import { StatCards } from "@/admin/features/audit/components/stat-cards";
import { getExternalRequests } from "../data/external-requests";
import type { ExternalChannel, ExternalRequest } from "../types";

const requests = getExternalRequests();

const channelLabels: Record<ExternalChannel, string> = { chat: "گفتگو", workflow: "جریان", api: "API" };

const outcomeOptions = [
  { value: "all", label: "همه" },
  { value: "sent", label: "پوشانده و ارسال شد" },
  { value: "rerouted", label: "به مدل داخلی منتقل شد" },
];

/** Requests that were meant for an external model: who, which model and what was masked. */
export function ExternalRequests({ fallbackName }: { fallbackName: string }) {
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState("all");
  const [outcome, setOutcome] = useState("all");

  const rows = useMemo(() => {
    const q = query.trim();
    return requests.filter(
      (r) =>
        (unit === "all" || r.unit === unit) &&
        (outcome === "all" || r.outcome === outcome) &&
        (!q || r.user.includes(q) || r.agent.includes(q) || r.masked.some((m) => m.includes(q))),
    );
  }, [query, unit, outcome]);

  const masked = rows.reduce((sum, r) => sum + r.masked.length, 0);
  const rerouted = rows.filter((r) => r.outcome === "rerouted").length;

  const columns: DataTableColumn<ExternalRequest>[] = [
    { id: "at", header: "زمان", className: "whitespace-nowrap text-body-sm text-muted-foreground", cell: (r) => formatDateTime(r.at) },
    {
      id: "user",
      header: "کاربر",
      cell: (r) => (
        <span className="flex flex-col">
          <span className="font-medium">{r.user}</span>
          <span className="text-caption text-muted-foreground">واحد {r.unit} · {channelLabels[r.channel]}</span>
        </span>
      ),
    },
    { id: "agent", header: "عامل", hideBelow: "lg", cell: (r) => r.agent },
    { id: "model", header: "مدل مقصد", cell: (r) => <bdi dir="ltr">{r.model}</bdi> },
    {
      id: "masked",
      header: "موارد پوشانده",
      cell: (r) =>
        r.masked.length === 0 ? (
          <span className="text-body-sm text-muted-foreground">بدون داده‌ی حساس</span>
        ) : (
          <span className="flex flex-col">
            <span className="tabular-nums">{formatNumber(r.masked.length)} مورد</span>
            <span className="text-caption text-muted-foreground">{r.masked.join("، ")}</span>
          </span>
        ),
    },
    {
      id: "outcome",
      header: "نتیجه",
      cell: (r) =>
        r.outcome === "sent" ? (
          <Badge variant="info">بیرونی، پوشانده‌شده</Badge>
        ) : (
          <Badge variant="warning">منتقل شد به {fallbackName}</Badge>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StatCards
        items={[
          { label: "درخواست به مدل بیرونی", value: formatNumber(rows.length) },
          { label: "موارد پوشانده‌شده", value: formatNumber(masked) },
          { label: "منتقل‌شده به مدل داخلی", value: formatNumber(rerouted), hint: "داده‌ای داشتند که بیرون رفتنش ممنوع است" },
          { label: "پوشاندن ناموفق", value: formatNumber(0), hint: "هیچ داده‌ی حساسی بدون پوشاندن بیرون نرفت" },
        ]}
      />
      <div className="flex flex-wrap items-end gap-4">
        <SearchField label="جست‌وجوی درخواست‌ها" placeholder="نام کاربر، عامل یا نوع داده" value={query} onValueChange={setQuery} />
        <FilterSelect id="ext-unit" label="واحد" value={unit} options={optionsOf(requests.map((r) => r.unit))} onValueChange={setUnit} />
        <FilterSelect id="ext-outcome" label="نتیجه" value={outcome} options={outcomeOptions} onValueChange={setOutcome} />
      </div>
      {rows.length === 0 ? (
        <EmptyState
          icon={<SearchXIcon />}
          title="درخواستی پیدا نشد"
          description="فیلترها را تغییر دهید."
          action={
            <Button variant="outline" onClick={() => { setQuery(""); setUnit("all"); setOutcome("all"); }}>
              پاک‌کردن فیلترها
            </Button>
          }
        />
      ) : (
        <DataTable
          label="درخواست‌هایی که به مدل بیرونی رفتند"
          rows={rows}
          columns={columns}
          getRowId={(r) => r.id}
          getRowLabel={(r) => `درخواست ${r.user}`}
          defaultPageSize={10}
        />
      )}
    </div>
  );
}
