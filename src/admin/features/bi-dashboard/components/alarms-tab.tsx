"use client";

import { BellOffIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatNumber } from "@/admin/lib/format";
import { severityLabels } from "../lib/form";
import type { BiAlarm, Severity } from "../types";
import { useBi } from "./bi-provider";

const severityBadge: Record<Severity, "secondary" | "warning" | "destructive"> = { info: "secondary", warning: "warning", critical: "destructive" };

const isOpen = (alarm: BiAlarm) => !alarm.resolved && alarm.state !== "acknowledged";

function stateLabel(alarm: BiAlarm) {
  if (alarm.resolved) return "رسیدگی‌شده";
  return alarm.state === "acknowledged" ? "دیده‌شده" : "ارسال‌شده";
}

/** Live alarms of indicators that are out of range now, alarms sent by hand, and the history. */
export function AlarmsTab() {
  const { alarms, acknowledge } = useBi();
  if (alarms.length === 0) {
    return <EmptyState icon={<BellOffIcon aria-hidden />} title="هشداری نیست" description="وقتی شاخصی از حد مجاز بیرون برود، هشدارش اینجا برای مسئولان دیده می‌شود." />;
  }
  const waiting = alarms.filter(isOpen).length;
  // One status mark per row: the pill is the severity; the state is quiet text, and only an open alarm keeps its action.
  const columns: DataTableColumn<BiAlarm>[] = [
    { id: "indicator", header: "شاخص", cell: (a) => <span className="flex flex-col items-start"><span className="font-medium">{a.indicatorName}</span><span className="text-body-sm text-muted-foreground">{formatDateTime(a.raisedAt)}</span></span> },
    { id: "value", header: "مقدار", align: "end", cell: (a) => <span className="flex flex-col items-end"><span className="font-medium">{formatNumber(a.value, { maximumFractionDigits: 2 })} <span className="text-body-sm font-normal text-muted-foreground">{a.unit}</span></span><span className="text-body-sm text-muted-foreground">{a.limitText}</span></span> },
    { id: "severity", header: "اهمیت", cell: (a) => <Badge variant={severityBadge[a.severity]}>{severityLabels[a.severity]}</Badge> },
    { id: "recipients", header: "گیرندگان", hideBelow: "xl", className: "text-muted-foreground", cell: (a) => (a.recipients.join("، ") || "—") },
    { id: "state", header: "وضعیت", cell: (a) => <span className={isOpen(a) ? "" : "text-muted-foreground"}>{stateLabel(a)}{a.manual ? " (دستی)" : ""}</span> },
  ];
  return (
    <div className="flex flex-col gap-4">
      <p className="text-body-sm text-muted-foreground">{formatNumber(alarms.length)} هشدار · {formatNumber(waiting)} منتظر رسیدگی</p>
      <DataTable
        label="فهرست هشدارها"
        rows={alarms}
        columns={columns}
        getRowId={(a) => a.id}
        getRowLabel={(a) => `هشدار ${a.indicatorName}`}
        getRowActions={(a) => (isOpen(a) ? [[{ label: "ثبت رسیدگی", icon: <CheckIcon aria-hidden />, inline: true, onSelect: () => { acknowledge(a.id); toast.success("رسیدگی ثبت شد."); } }]] : [])}
        defaultPageSize={10}
        hidePagerWhenSingle
        renderCard={(a, actions) => (
          <>
            <div className="flex items-start justify-between gap-3"><span className="font-medium">{a.indicatorName}</span>{actions}</div>
            <p className="text-body-sm text-muted-foreground">{formatNumber(a.value, { maximumFractionDigits: 2 })} {a.unit} · {a.limitText} · {stateLabel(a)}</p>
          </>
        )}
      />
    </div>
  );
}
