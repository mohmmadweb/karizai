import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import { tomanPer1kTokens } from "@/lib/policy-store";
import type { UsageRow } from "../types";

/** Toman cost of a row: internal and external tokens at the organization's rates. */
export function rowCost(row: UsageRow): number {
  const external = row.internal ? 0 : (row.externalShare ?? 1);
  return Math.round((row.tokens / 1000) * (external * tomanPer1kTokens.external + (1 - external) * tomanPer1kTokens.internal));
}

export function UsageTable({ title, rows }: { title: string; rows: UsageRow[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-h4">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام</TableHead>
            <TableHead className="text-end">درخواست</TableHead>
            <TableHead className="text-end">توکن</TableHead>
            <TableHead className="text-end">هزینه (تومان)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell className="text-end tabular-nums">{formatNumber(row.requests)}</TableCell>
              <TableCell className="text-end tabular-nums">{formatNumber(row.tokens)}</TableCell>
              <TableCell className="text-end tabular-nums">{formatNumber(rowCost(row))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
