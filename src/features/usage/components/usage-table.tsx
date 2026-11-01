import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import type { UsageRow } from "../types";

export function UsageTable({ title, rows }: { title: string; rows: UsageRow[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-h4">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام</TableHead>
            <TableHead>درخواست</TableHead>
            <TableHead>توکن</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{formatNumber(row.requests)}</TableCell>
              <TableCell>{formatNumber(row.tokens)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
