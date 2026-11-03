"use client";

import { EyeIcon, InfoIcon } from "lucide-react";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/admin/lib/format";
import { formatCost } from "../lib/format-rows";
import { nameHeader } from "../lib/rows";
import type { ReportView, UsageRow } from "../types";

type Props = {
  view: ReportView;
  rows: UsageRow[];
  total?: UsageRow;
  unpricedCount: number;
  /** Opens the per-model details of a row; omitted where details do not apply. */
  onDetails?: (row: UsageRow) => void;
};

function NameCell({ row }: { row: UsageRow }) {
  return (
    <span className="flex flex-col items-start gap-0.5">
      <span className="flex flex-wrap items-center gap-2">
        <span className={row.id === "total" ? "font-semibold" : "font-medium"}>{row.name}</span>
        {row.inactive ? <Badge variant="secondary">غیرفعال</Badge> : null}
      </span>
      {row.hint ? (
        <bdi dir="auto" className="text-caption text-muted-foreground">
          {row.hint}
        </bdi>
      ) : null}
    </span>
  );
}

export function BreakdownTable({ view, rows, total, unpricedCount, onDetails }: Props) {
  const num = (id: string, header: string, pick: (r: UsageRow) => number): DataTableColumn<UsageRow> => ({
    id,
    header,
    align: "end",
    cell: (r) => formatNumber(pick(r)),
  });
  const columns: DataTableColumn<UsageRow>[] = [
    { id: "name", header: nameHeader[view], cell: (r) => <NameCell row={r} /> },
    num("requests", "درخواست‌ها", (r) => r.requests),
    num("input", "توکن ورودی", (r) => r.inputTokens),
    num("output", "توکن خروجی", (r) => r.outputTokens),
    { id: "cost", header: "هزینه‌ی تقریبی", align: "end", cell: (r) => formatCost(r.cost) },
  ];

  return (
    <div className="flex flex-col gap-3">
      {unpricedCount > 0 ? (
        <Alert variant="info" role="status">
          <InfoIcon aria-hidden />
          <AlertDescription>
            برای {formatNumber(unpricedCount)} مدل هزینه ثبت نشده و در هزینه‌ی تقریبی نیامده است.
          </AlertDescription>
        </Alert>
      ) : null}
      <DataTable
        label={`مصرف به تفکیک ${nameHeader[view]}`}
        rows={rows}
        columns={columns}
        totalRow={total}
        getRowId={(r) => r.id}
        getRowLabel={(r) => `${nameHeader[view]} ${r.name}`}
        getRowActions={
          onDetails
            ? (r) => [
                [
                  {
                    label: "جزئیات",
                    icon: <EyeIcon aria-hidden />,
                    inline: true,
                    onSelect: () => onDetails(r),
                  },
                ],
              ]
            : undefined
        }
        defaultPageSize={10}
        renderCard={(r, actions) => (
          <>
            <div className="flex items-start justify-between gap-3">
              <NameCell row={r} />
              {actions}
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-body-sm">
              <dt className="text-muted-foreground">درخواست‌ها</dt>
              <dd className="text-end tabular-nums">{formatNumber(r.requests)}</dd>
              <dt className="text-muted-foreground">توکن ورودی</dt>
              <dd className="text-end tabular-nums">{formatNumber(r.inputTokens)}</dd>
              <dt className="text-muted-foreground">توکن خروجی</dt>
              <dd className="text-end tabular-nums">{formatNumber(r.outputTokens)}</dd>
              <dt className="text-muted-foreground">هزینه‌ی تقریبی</dt>
              <dd className="text-end tabular-nums">{formatCost(r.cost)}</dd>
            </dl>
          </>
        )}
      />
      {view === "group" ? (
        <p className="text-caption text-muted-foreground">
          کاربری که عضو چند گروه است برای هر گروهش شمرده می‌شود؛ پس جمع گروه‌ها می‌تواند از مصرف کل بیشتر باشد.
        </p>
      ) : null}
    </div>
  );
}
