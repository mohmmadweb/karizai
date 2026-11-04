import type { ReactNode } from "react";
import { DashedEmpty } from "@/components/shared/moto/moto";
import { formatNumber } from "@/lib/format";

export type Column<T> = { head: string; cell: (row: T) => ReactNode; className?: string };

/** White card, navy header row, rows about 60px, a «نمایش N آیتم» note in the footer. */
export function ContentTable<T>({ rows, columns, rowKey, total, empty = "موردی یافت نشد" }: { rows: T[]; columns: Column<T>[]; rowKey: (row: T) => string; total: number; empty?: string }) {
  if (rows.length === 0) return <DashedEmpty title={empty} />;
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-body-sm">
          <thead className="bg-primary text-primary-foreground">
            <tr>{columns.map((c) => <th key={c.head} className="px-4 py-3 text-start font-medium whitespace-nowrap">{c.head}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="h-15 border-b last:border-0">
                {columns.map((c) => <td key={c.head} className={c.className ?? "px-4 py-2"}>{c.cell(row)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t px-4 py-3 text-caption text-muted-foreground">نمایش {formatNumber(rows.length)} آیتم از {formatNumber(total)}</p>
    </div>
  );
}
