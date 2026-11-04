"use client";

import { useMemo, useState } from "react";
import { DownloadIcon, EyeIcon, SearchXIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { buildCsv, downloadCsv } from "@/admin/features/usage-report/lib/export-csv";
import { formatDateTime } from "@/admin/lib/format";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLive } from "@/features/live/components/live-provider";
import { auditNow, getAuditEvents } from "../data/audit-events";
import { channelLabels, resultLabels, type AuditEvent } from "../types";
import { AuditDetailSheet } from "./audit-detail-sheet";
import { FilterSelect, optionsOf } from "./filter-select";
import { ResultBadge } from "./result-badge";
import { StatCards } from "./stat-cards";

const seedEvents = getAuditEvents();
const day = 86_400_000;
const startOfToday = auditNow - 12 * 3_600_000;
const periods = [
  { value: "today", label: "امروز", from: startOfToday, to: Infinity },
  { value: "yesterday", label: "دیروز", from: startOfToday - day, to: startOfToday },
  { value: "week", label: "۷ روز گذشته", from: startOfToday - 6 * day, to: Infinity },
  { value: "all", label: "همه", from: -Infinity, to: Infinity },
];
const toOptions = (labels: Record<string, string>) => [{ value: "all", label: "همه" }, ...Object.entries(labels).map(([value, label]) => ({ value, label }))];
const n = (v: number) => v.toLocaleString("fa-IR");
const initial = { period: "week", user: "all", agent: "all", result: "all", channel: "all" };

/** «ممیزی»: every access and action of users and Agents, with filters and a CSV export. */
export function AuditPageContent() {
  const [f, setF] = useState(initial);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<AuditEvent | null>(null);
  // What workflow runs did in this visit comes first; those rows count as «today» in every period.
  const { audit } = useLive();
  const events = useMemo<AuditEvent[]>(() => [...audit, ...seedEvents], [audit]);
  const isLive = (e: AuditEvent) => e.id.startsWith("live-audit");
  const set = (key: keyof typeof initial) => (value: string) => setF((s) => ({ ...s, [key]: value }));

  const rows = useMemo(() => {
    const p = periods.find((x) => x.value === f.period)!;
    const q = query.trim();
    return events.filter((e) => {
      const t = new Date(e.at).getTime();
      return (
        (isLive(e) ? f.period !== "yesterday" : t >= p.from && t < p.to) &&
        (f.user === "all" || e.user === f.user) &&
        (f.agent === "all" || e.agent === f.agent) &&
        (f.result === "all" || e.result === f.result) &&
        (f.channel === "all" || e.channel === f.channel) &&
        (!q || [e.user, e.agent, e.source, e.model, e.action, e.reason ?? ""].some((x) => x.includes(q)))
      );
    });
  }, [f, query, events]);

  function exportCsv() {
    const csv = buildCsv(rows, [
      { header: "زمان", value: (e) => formatDateTime(e.at) },
      { header: "کاربر", value: (e) => e.user },
      { header: "واحد", value: (e) => e.unit },
      { header: "عامل", value: (e) => e.agent },
      { header: "ابزار یا منبع", value: (e) => e.source },
      { header: "مدل", value: (e) => e.model },
      { header: "نوع", value: (e) => channelLabels[e.channel] },
      { header: "نتیجه", value: (e) => resultLabels[e.result] + (e.reason ? `: ${e.reason}` : "") },
      { header: "شرح", value: (e) => e.action },
    ]);
    downloadCsv(csv, "ممیزی-کاریز.csv");
    toast.success("خروجی CSV آماده شد.");
  }

  const columns: DataTableColumn<AuditEvent>[] = [
    { id: "at", header: "زمان", className: "whitespace-nowrap text-body-sm text-muted-foreground", cell: (e) => formatDateTime(e.at) },
    { id: "user", header: "کاربر", cell: (e) => <span className="flex flex-col"><span className="flex flex-wrap items-center gap-1.5 font-medium">{e.user}{isLive(e) ? <Badge variant="info">همین حالا</Badge> : null}</span><span className="text-caption text-muted-foreground">{channelLabels[e.channel]} · واحد {e.unit}</span></span> },
    { id: "agent", header: "عامل", hideBelow: "lg", className: "max-w-48 whitespace-normal", cell: (e) => e.agent },
    { id: "source", header: "ابزار / منبع", hideBelow: "lg", className: "max-w-56 whitespace-normal text-body-sm", cell: (e) => e.source },
    { id: "model", header: "مدل", hideBelow: "xl", className: "whitespace-normal text-body-sm", cell: (e) => e.model },
    { id: "result", header: "نتیجه", cell: (e) => <ResultBadge result={e.result} event={e} /> },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="ممیزی"
        description="سابقه‌ی همه‌ی دسترسی‌ها و کارهای کاربران و عامل‌ها در گفتگو، جریان‌ها و API؛ از جمله درخواست‌هایی که رد شدند."
        action={<Button variant="outline" disabled={rows.length === 0} onClick={exportCsv}><DownloadIcon aria-hidden />خروجی CSV</Button>}
      />
      <StatCards
        items={[
          { label: "رویدادها", value: n(rows.length) },
          { label: "موفق", value: n(rows.filter((e) => e.result === "success").length) },
          { label: "منتظر تأیید", value: n(rows.filter((e) => e.result === "pending").length) },
          { label: "دسترسی رد شد", value: n(rows.filter((e) => e.result === "denied").length) },
        ]}
      />
      <div className="flex flex-col gap-4">
        <SearchField label="جست‌وجوی رویدادها" placeholder="کاربر، عامل، منبع یا شرح" value={query} onValueChange={setQuery} />
        <div className="flex flex-wrap items-end gap-4">
          <FilterSelect id="audit-period" label="بازه" value={f.period} options={periods} onValueChange={set("period")} />
          <FilterSelect id="audit-user" label="کاربر" value={f.user} options={optionsOf(events.map((e) => e.user))} onValueChange={set("user")} />
          <FilterSelect id="audit-agent" label="عامل" value={f.agent} options={optionsOf(events.map((e) => e.agent))} onValueChange={set("agent")} />
          <FilterSelect id="audit-result" label="نتیجه" value={f.result} options={toOptions(resultLabels)} onValueChange={set("result")} />
          <FilterSelect id="audit-channel" label="نوع" value={f.channel} options={toOptions(channelLabels)} onValueChange={set("channel")} />
        </div>
      </div>
      {rows.length === 0 ? (
        <EmptyState
          icon={<SearchXIcon />}
          title="رویدادی پیدا نشد"
          description="بازه یا فیلترهای دیگری را امتحان کنید."
          action={<Button variant="outline" onClick={() => { setF({ ...initial, period: "all" }); setQuery(""); }}>پاک‌کردن فیلترها</Button>}
        />
      ) : (
        <DataTable
          label="رویدادهای ممیزی"
          rows={rows}
          columns={columns}
          getRowId={(e) => e.id}
          getRowLabel={(e) => `رویداد ${e.action}`}
          getRowActions={(e) => [[{ label: "جزئیات", icon: <EyeIcon aria-hidden />, inline: true, onSelect: () => setOpen(e) }]]}
          pageSizeOptions={[10, 20, 50]}
          renderCard={(e, actions) => (
            <>
              <div className="flex items-start justify-between gap-3">
                <span className="font-medium">{e.action}</span>
                {actions}
              </div>
              <span className="text-caption text-muted-foreground">{formatDateTime(e.at)} · {e.user} · {e.agent}</span>
              <ResultBadge result={e.result} event={e} />
            </>
          )}
        />
      )}
      <AuditDetailSheet event={open} onOpenChange={(o) => !o && setOpen(null)} />
    </div>
  );
}
