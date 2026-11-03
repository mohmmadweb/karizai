"use client";

import Link from "next/link";
import { EyeIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableActionGroup, DataTableColumn } from "@/admin/components/shared/data-table/types";
import { formatDateTime, formatNumber } from "@/admin/lib/format";
import { useDeleteDocuments } from "../../hooks/use-delete-document";
import { useDocuments } from "../../hooks/use-documents";
import { documentsOfSource, intervalLabel, protocolLabel, sourceLocation } from "../../lib/selectors";
import type { FileSource } from "../../types";
import { SourceTestBadge } from "./source-badges";

const linkClass =
  "rounded-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

export function SourcesList({ sources }: { sources: FileSource[] }) {
  const { documents, syncNow, syncing } = useDocuments();
  const { removeSource } = useDeleteDocuments();
  const count = (s: FileSource) => documentsOfSource(s.id, documents).length;
  const last = (s: FileSource) => (s.lastSyncAt ? formatDateTime(s.lastSyncAt) : "همگام‌سازی نشده");

  const columns: DataTableColumn<FileSource>[] = [
    { id: "name", header: "منبع", cell: (s) => <Link href={`/admin/documents/sources/${s.id}`} className={linkClass}>{s.name}</Link> },
    {
      id: "address",
      header: "نشانی و مسیر",
      hideBelow: "xl",
      className: "text-muted-foreground",
      cell: (s) => (
        <bdi dir="ltr" className="block max-w-56 truncate" title={`${protocolLabel[s.protocol]} ${sourceLocation(s)}`}>
          {protocolLabel[s.protocol]} · {sourceLocation(s)}
        </bdi>
      ),
    },
    { id: "test", header: "آزمایش اتصال", cell: (s) => <SourceTestBadge result={s.testResult} /> },
    { id: "interval", header: "همگام‌سازی", hideBelow: "lg", cell: (s) => <span className="flex flex-col"><span>{intervalLabel[s.syncIntervalMinutes]}</span><span className="text-caption text-muted-foreground">{last(s)}</span></span> },
    { id: "count", header: "اسناد", align: "end", cell: (s) => formatNumber(count(s)) },
  ];

  const actionsOf = (s: FileSource): DataTableActionGroup[] => [
    [{ label: "مشاهده جزئیات", icon: <EyeIcon aria-hidden />, inline: true, href: `/admin/documents/sources/${s.id}` }],
    [
      {
        label: s.testResult === "success" ? "همگام‌سازی حالا" : "همگام‌سازی حالا (ابتدا آزمایش کنید)",
        icon: <RefreshCwIcon aria-hidden />,
        disabled: s.testResult !== "success" || Boolean(syncing[s.id]),
        onSelect: async () => {
          const r = await syncNow(s.id);
          if (r) toast.success(`همگام‌سازی انجام شد: ${formatNumber(r.added)} تازه، ${formatNumber(r.changed)} تغییرکرده، ${formatNumber(r.removed)} حذف‌شده.`);
        },
      },
    ],
    [
      {
        label: "حذف",
        icon: <Trash2Icon aria-hidden />,
        destructive: true,
        onSelect: () => {
          removeSource(s.id);
          toast.success("منبع حذف شد.");
        },
        confirm: {
          title: `منبع «${s.name}» حذف شود؟`,
          description: `${formatNumber(count(s))} سند آمده از این منبع و دسترسی‌هایشان از سامانه برداشته می‌شود. فایل‌های فایل‌سرور دست‌نخورده می‌ماند.`,
          confirmLabel: "حذف",
        },
      },
    ],
  ];

  return (
    <DataTable
      label="فهرست منابع فایل‌سرور"
      rows={sources}
      columns={columns}
      getRowId={(s) => s.id}
      getRowLabel={(s) => `منبع ${s.name}`}
      getRowActions={actionsOf}
      defaultPageSize={5}
      renderCard={(s, actions) => (
        <>
          <div className="flex items-start justify-between gap-3">
            <Link href={`/admin/documents/sources/${s.id}`} className={linkClass}>{s.name}</Link>
            {actions}
          </div>
          <p className="truncate text-body-sm text-muted-foreground"><bdi dir="ltr">{protocolLabel[s.protocol]} · {sourceLocation(s)}</bdi></p>
          <div className="flex flex-wrap items-center gap-2">
            <SourceTestBadge result={s.testResult} />
            <span className="text-body-sm text-muted-foreground">{intervalLabel[s.syncIntervalMinutes]} · {formatNumber(count(s))} سند</span>
          </div>
        </>
      )}
    />
  );
}
