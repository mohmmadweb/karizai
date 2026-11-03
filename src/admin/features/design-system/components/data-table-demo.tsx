"use client";

import { EyeIcon, Trash2Icon } from "lucide-react";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/admin/lib/format";
import { getSampleRows } from "../data/reference";
import type { SampleRow } from "../types";

const columns: DataTableColumn<SampleRow>[] = [
  { id: "name", header: "نام", cell: (row) => <span className="font-medium">{row.name}</span> },
  {
    id: "status",
    header: "وضعیت",
    cell: (row) => <Badge variant={row.status}>{row.statusLabel}</Badge>,
  },
  { id: "amount", header: "مقدار", align: "end", cell: (row) => formatNumber(row.amount) },
];

/** Page, page size, and the action menu are temporary and reset on reload. */
export function DataTableDemo() {
  return (
    <DataTable
      label="جدول نمونه"
      rows={getSampleRows()}
      columns={columns}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      defaultPageSize={5}
      getRowActions={(row) => [
        [{ label: "مشاهده جزئیات", icon: <EyeIcon aria-hidden />, inline: true, onSelect: () => {} }],
        [
          {
            label: "حذف",
            icon: <Trash2Icon aria-hidden />,
            destructive: true,
            confirm: {
              title: `«${row.name}» حذف شود؟`,
              description: "این یک نمونه‌ی نمایشی از تأیید پیش از عملیات حساس است.",
              confirmLabel: "حذف",
            },
          },
        ],
      ]}
      renderCard={(row, actions) => (
        <>
          <div className="flex items-center justify-between gap-2">
            <span className="text-label">{row.name}</span>
            <div className="flex items-center gap-1">
              <Badge variant={row.status}>{row.statusLabel}</Badge>
              {actions}
            </div>
          </div>
          <span className="text-body-sm text-muted-foreground tabular-nums">
            {formatNumber(row.amount)}
          </span>
        </>
      )}
    />
  );
}
