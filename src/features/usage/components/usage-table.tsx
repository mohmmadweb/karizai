import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import { tomanPer1kTokens } from "@/lib/pricing";
import type { UsageRow } from "../types";

/** Toman cost of a row: internal and external tokens at the organization's rates. */
export function rowCost(row: UsageRow): number {
  const external = row.internal ? 0 : (row.externalShare ?? 1);
  return Math.round((row.tokens / 1000) * (external * tomanPer1kTokens.external + (1 - external) * tomanPer1kTokens.internal));
}

/** Costs of the rows; with `total` given they are scaled (largest remainder) so the column sums exactly to it. */
export function rowCosts(rows: UsageRow[], total?: number): number[] {
  const raw = rows.map(rowCost);
  const sum = raw.reduce((a, b) => a + b, 0);
  if (total === undefined || sum === 0) return raw;
  const exact = raw.map((cost) => (cost / sum) * total);
  const floors = exact.map(Math.floor);
  let left = total - floors.reduce((a, b) => a + b, 0);
  exact.map((value, index) => ({ index, rest: value - Math.floor(value) })).sort((a, b) => b.rest - a.rest).forEach(({ index }) => { if (left > 0) { floors[index]! += 1; left -= 1; } });
  return floors;
}

export function UsageTable({ title, rows, costs }: { title: string; rows: UsageRow[]; costs?: number[] }) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
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
          {rows.map((row, index) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell className="text-end tabular-nums">{formatNumber(row.requests)}</TableCell>
              <TableCell className="text-end tabular-nums">{formatNumber(row.tokens)}</TableCell>
              <TableCell className="text-end tabular-nums">{formatNumber(costs?.[index] ?? rowCost(row))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
