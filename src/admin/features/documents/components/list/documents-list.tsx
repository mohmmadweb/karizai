"use client";

import Link from "@/components/shared/app-link";
import { EyeIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableActionGroup, DataTableColumn } from "@/admin/components/shared/data-table/types";
import { formatBytes } from "@/admin/lib/format";
import { useDeleteDocuments } from "../../hooks/use-delete-document";
import { useDocuments } from "../../hooks/use-documents";
import { languageLabel } from "../../lib/detect-language";
import { sourceOf } from "../../lib/selectors";
import type { DocumentRecord } from "../../types";
import { ConfidentialBadge, DocStatusBadge } from "./doc-badges";

const linkClass =
  "rounded-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

export function DocumentsList({ docs }: { docs: DocumentRecord[] }) {
  const { sources, reprocess } = useDocuments();
  const { removeDocument } = useDeleteDocuments();
  const origin = (d: DocumentRecord) => sourceOf(d, sources)?.name ?? "بارگذاری دستی";

  const columns: DataTableColumn<DocumentRecord>[] = [
    {
      id: "name",
      header: "سند",
      cell: (d) => (
        <span className="flex flex-col items-start gap-1">
          <Link href={`/admin/documents/${d.id}`} className={linkClass}>{d.name}</Link>
          <ConfidentialBadge confidential={d.confidential} />
        </span>
      ),
    },
    { id: "type", header: "نوع", hideBelow: "lg", cell: (d) => <bdi dir="ltr" className="uppercase">{d.extension}</bdi> },
    { id: "lang", header: "زبان", hideBelow: "lg", cell: (d) => languageLabel[d.language] },
    { id: "size", header: "حجم", hideBelow: "xl", align: "end", cell: (d) => formatBytes(d.sizeBytes) },
    { id: "source", header: "منبع", hideBelow: "xl", className: "text-muted-foreground", cell: origin },
    { id: "status", header: "وضعیت", cell: (d) => <DocStatusBadge status={d.status} /> },
  ];

  const actionsOf = (d: DocumentRecord): DataTableActionGroup[] => [
    [{ label: "مشاهده جزئیات", icon: <EyeIcon aria-hidden />, inline: true, href: `/admin/documents/${d.id}` }],
    [
      {
        label: "پردازش دوباره",
        icon: <RefreshCwIcon aria-hidden />,
        disabled: d.status === "processing",
        onSelect: () => {
          reprocess(d.id);
          toast.success("پردازش دوباره شروع شد.");
        },
      },
    ],
    [
      {
        label: "حذف",
        icon: <Trash2Icon aria-hidden />,
        destructive: true,
        onSelect: () => {
          removeDocument(d.id);
          toast.success("سند حذف شد.");
        },
        confirm: {
          title: `سند «${d.name}» حذف شود؟`,
          description: "سند از پاسخ‌ها کنار می‌رود و دسترسی‌هایی که برایش تعیین شده هم برداشته می‌شود.",
          confirmLabel: "حذف",
        },
      },
    ],
  ];

  return (
    <DataTable
      label="فهرست اسناد"
      rows={docs}
      columns={columns}
      getRowId={(d) => d.id}
      getRowLabel={(d) => `سند ${d.name}`}
      getRowActions={actionsOf}
      defaultPageSize={5}
      renderCard={(d, actions) => (
        <>
          <div className="flex items-start justify-between gap-3">
            <Link href={`/admin/documents/${d.id}`} className={linkClass}>{d.name}</Link>
            {actions}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DocStatusBadge status={d.status} />
            <ConfidentialBadge confidential={d.confidential} />
          </div>
          <p className="text-body-sm text-muted-foreground">
            <bdi dir="ltr" className="uppercase">{d.extension}</bdi> · {languageLabel[d.language]} · {formatBytes(d.sizeBytes)} · {origin(d)}
          </p>
        </>
      )}
    />
  );
}
