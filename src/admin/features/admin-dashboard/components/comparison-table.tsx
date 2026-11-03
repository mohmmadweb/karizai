import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/admin/lib/format";
import { differenceOf, metricKeys, metricLabels, verdictLabels, type MetricKey } from "../lib/comparison";
import type { ComparisonTask, Measure } from "../types";

const unit: Record<MetricKey, string> = { cost: "تومان", tokens: "توکن", accuracy: "٪", seconds: "ثانیه" };
const show = (key: MetricKey, value: number) =>
  key === "accuracy" ? `${formatNumber(value)}٪` : `${formatNumber(value)} ${unit[key]}`;
const badge = { better: "success", worse: "destructive", equal: "secondary" } as const;

function Diff({ k, direct, multi }: { k: MetricKey; direct: Measure; multi: Measure }) {
  const d = differenceOf(k, direct[k], multi[k]);
  return (
    <span className="flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
      {d.text}
      <Badge variant={badge[d.verdict]}>{verdictLabels[d.verdict]}</Badge>
    </span>
  );
}

function Cell({ k, m, other }: { k: MetricKey; m: Measure; other?: Measure }) {
  return (
    <span className="flex flex-col gap-1 tabular-nums">
      <span className="text-foreground">{show(k, m[k])}</span>
      {other ? <Diff k={k} direct={other} multi={m} /> : null}
    </span>
  );
}

export function ComparisonTable({ tasks }: { tasks: ComparisonTask[] }) {
  return (
    <div className="flex flex-col gap-3">
      <Card className="hidden overflow-hidden p-0 md:block">
        <Table aria-label="مقایسه‌ی اجرای مستقیم و چندایجنتی">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead>نوع کار</TableHead>
              <TableHead>حالت اجرا</TableHead>
              {metricKeys.map((k) => <TableHead key={k}>{metricLabels[k]}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.flatMap((t) => [
              <TableRow key={`${t.id}-d`} className="border-b-0">
                <TableCell rowSpan={2} className="whitespace-normal align-top font-medium">{t.name}</TableCell>
                <TableCell>اجرای مستقیم با یک مدل</TableCell>
                {metricKeys.map((k) => <TableCell key={k}><Cell k={k} m={t.direct} /></TableCell>)}
              </TableRow>,
              <TableRow key={`${t.id}-m`}>
                <TableCell>اجرای چندایجنتی</TableCell>
                {metricKeys.map((k) => <TableCell key={k}><Cell k={k} m={t.multi} other={t.direct} /></TableCell>)}
              </TableRow>,
            ])}
          </TableBody>
        </Table>
      </Card>
      <ul className="flex flex-col gap-3 md:hidden">
        {tasks.map((t) => (
          <li key={t.id}>
            <Card className="gap-3 p-4">
              <h3 className="text-body font-medium text-foreground">{t.name}</h3>
              {(["direct", "multi"] as const).map((mode) => (
                <div key={mode} className="flex flex-col gap-2">
                  <p className="text-body-sm font-medium text-foreground">
                    {mode === "direct" ? "اجرای مستقیم با یک مدل" : "اجرای چندایجنتی"}
                  </p>
                  <dl className="grid grid-cols-2 gap-3 text-caption text-muted-foreground">
                    {metricKeys.map((k) => (
                      <div key={k}>
                        <dt>{metricLabels[k]}</dt>
                        <dd><Cell k={k} m={t[mode]} other={mode === "multi" ? t.direct : undefined} /></dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </Card>
          </li>
        ))}
      </ul>
      <p className="text-caption text-muted-foreground">
        هر دو حالت با شرایط آزمون یکسان (همان پرسش و همان داده) سنجیده شده‌اند.
      </p>
    </div>
  );
}
