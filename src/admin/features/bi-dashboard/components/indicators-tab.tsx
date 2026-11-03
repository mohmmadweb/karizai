"use client";

import { useState } from "react";
import { GaugeIcon, PauseIcon, PencilIcon, PlayIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { formatNumber } from "@/admin/lib/format";
import { limitsText, readingFor, statusLabels, statusOf } from "../lib/series";
import { sourceLabels } from "../lib/validation";
import type { Indicator, IndicatorStatus } from "../types";
import { useBi } from "./bi-provider";
import { IndicatorDialog } from "./indicator-dialog";

/** The current status of an enabled indicator, or `null` when it is paused. */
function liveOf(indicator: Indicator): { value: number; status: IndicatorStatus } | null {
  if (!indicator.enabled) return null;
  const { current } = readingFor(indicator);
  return { value: current, status: statusOf(indicator, current) };
}

const pill: Record<Exclude<IndicatorStatus, "ok">, "destructive" | "warning"> = { out: "destructive", near: "warning" };

/** All indicators with their current value, limits, source and responsible people; add, edit, pause and delete. */
export function IndicatorsTab() {
  const { indicators, removeIndicator, setEnabled } = useBi();
  const { users, groups } = useDirectory();
  const [editing, setEditing] = useState<Indicator | null>(null);
  const [open, setOpen] = useState(false);
  const openForm = (indicator: Indicator | null) => { setEditing(indicator); setOpen(true); };
  const responsible = (item: Indicator) => [...item.groupIds.map((id) => groups.find((g) => g.id === id)?.name), ...item.userIds.map((id) => users.find((u) => u.id === id)?.name)].filter(Boolean).join("، ");
  const outCount = indicators.filter((item) => liveOf(item)?.status === "out").length;
  const pausedCount = indicators.filter((item) => !item.enabled).length;

  // Only the exceptions get a pill; an indicator inside its range is quiet grey text.
  const status = (item: Indicator) => {
    const live = liveOf(item);
    if (!live) return <Badge variant="secondary">غیرفعال</Badge>;
    if (live.status === "ok") return <span className="text-muted-foreground">{statusLabels.ok}</span>;
    return <Badge variant={pill[live.status]}>{statusLabels[live.status]}</Badge>;
  };

  const columns: DataTableColumn<Indicator>[] = [
    { id: "name", header: "شاخص", cell: (i) => <span className="flex flex-col items-start"><span className="font-medium">{i.name}</span><span className="text-body-sm text-muted-foreground">{sourceLabels[i.source]}</span></span> },
    { id: "current", header: "مقدار فعلی", align: "end", cell: (i) => { const live = liveOf(i); return live ? <span className="font-medium">{formatNumber(live.value, { maximumFractionDigits: 2 })} <span className="text-body-sm font-normal text-muted-foreground">{i.unit}</span></span> : <span className="text-muted-foreground">—</span>; } },
    { id: "limits", header: "حد مجاز", align: "end", className: "text-muted-foreground", cell: (i) => limitsText(i) },
    { id: "status", header: "وضعیت", cell: status },
    { id: "refresh", header: "خواندن", hideBelow: "xl", className: "text-muted-foreground", cell: (i) => (i.source === "manual" ? "دستی" : `هر ${formatNumber(i.refreshMinutes)} دقیقه`) },
    { id: "responsible", header: "مسئولان", hideBelow: "lg", className: "text-muted-foreground", cell: responsible },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body-sm text-muted-foreground">
          {formatNumber(indicators.length)} شاخص
          {indicators.length > 0 ? ` · ${formatNumber(outCount)} خارج از حد · ${formatNumber(pausedCount)} غیرفعال` : ""}
        </p>
        <Button onClick={() => openForm(null)}><PlusIcon aria-hidden />شاخص تازه</Button>
      </div>
      {indicators.length === 0 ? (
        <EmptyState icon={<GaugeIcon aria-hidden />} title="هنوز شاخصی تعریف نشده است" description="برای هر شاخص یک حد مجاز و مسئولانش را تعیین کنید تا هنگام خروج از حد هشدار ساخته شود." />
      ) : (
        <DataTable
          label="فهرست شاخص‌ها"
          rows={indicators}
          columns={columns}
          getRowId={(i) => i.id}
          getRowLabel={(i) => `شاخص ${i.name}`}
          getRowActions={(i) => [
            [{ label: "ویرایش", icon: <PencilIcon aria-hidden />, onSelect: () => openForm(i) }, { label: i.enabled ? "غیرفعال‌سازی" : "فعال‌سازی", icon: i.enabled ? <PauseIcon aria-hidden /> : <PlayIcon aria-hidden />, onSelect: () => setEnabled(i.id, !i.enabled) }],
            [{ label: "حذف", icon: <Trash2Icon aria-hidden />, destructive: true, confirm: { title: "شاخص حذف شود؟", description: `شاخص «${i.name}» و هشدارهای فعالش از داشبورد برداشته می‌شود. سابقه‌ی هشدارهای قبلی می‌ماند.`, confirmLabel: "حذف شاخص" }, onSelect: () => { removeIndicator(i.id); toast.success("شاخص حذف شد."); } }],
          ]}
          defaultPageSize={10}
          hidePagerWhenSingle
          renderCard={(i, actions) => (
            <>
              <div className="flex items-start justify-between gap-3"><span className="font-medium">{i.name}</span>{actions}</div>
              <p className="text-body-sm text-muted-foreground">{limitsText(i)}</p>
              <div>{status(i)}</div>
            </>
          )}
        />
      )}
      <IndicatorDialog open={open} indicator={editing} onOpenChange={setOpen} />
    </div>
  );
}
