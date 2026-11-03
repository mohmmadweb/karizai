import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import type { Row } from "../hooks/use-comparison";
import type { RunResult } from "../lib/estimate";

const Cell = ({ result }: { result?: RunResult }) =>
  result ? (
    <TableCell className="tabular-nums">
      <span className="block">{formatNumber(result.seconds, { minimumFractionDigits: 1 })} ثانیه</span>
      <span className="text-caption text-muted-foreground">{formatNumber(result.cost)} تومان، {formatNumber(result.tokens)} توکن</span>
    </TableCell>
  ) : (
    <TableCell><Spinner aria-label="در حال اجرا" /></TableCell>
  );

/** Time and cost of each model in the two modes, side by side. */
export function CompareTable({ rows }: { rows: Row[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow><TableHead>مدل</TableHead><TableHead>اجرای مستقیم</TableHead><TableHead>اجرای چندایجنتی</TableHead><TableHead>تفاوت زمان</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ model, direct, multi }) => (
          <TableRow key={model.id}>
            <TableCell><span className="block text-label">{model.name}</span><span className="text-caption text-muted-foreground">{model.isInternal ? "مدل داخلی" : model.provider}</span></TableCell>
            <Cell result={direct} />
            <Cell result={multi} />
            <TableCell className="tabular-nums">{direct && multi ? `${formatNumber(Math.round((1 - multi.seconds / direct.seconds) * 100))}٪ سریع‌تر` : "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
