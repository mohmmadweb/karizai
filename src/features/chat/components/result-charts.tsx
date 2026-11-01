import { formatNumber } from "@/lib/format";
import type { StructuredResult } from "../types";

const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

type ChartProps = { result: StructuredResult };

const values = (result: StructuredResult) => result.rows.map((row) => Number(row[1]) || 0);

/** Horizontal bars: label, bar, number. Works well for Persian labels in RTL. */
export function BarChart({ result }: ChartProps) {
  const data = values(result);
  const max = Math.max(...data, 1);
  return (
    <ul className="flex flex-col gap-2" aria-label="نمودار میله‌ای">
      {result.rows.map((row, index) => (
        <li key={String(row[0])} className="grid grid-cols-[7rem_1fr_4rem] items-center gap-3 text-body-sm">
          <span className="truncate">{row[0]}</span>
          <span className="h-3 rounded-full bg-muted"><span className="block h-full rounded-full" style={{ width: `${(data[index] / max) * 100}%`, background: colors[0] }} /></span>
          <span className="text-muted-foreground">{formatNumber(data[index])}</span>
        </li>
      ))}
    </ul>
  );
}

export function LineChart({ result }: ChartProps) {
  const data = values(result);
  const max = Math.max(...data, 1);
  const width = 320;
  const height = 120;
  const step = width / Math.max(data.length - 1, 1);
  // The x axis runs right to left in RTL, so the first month sits on the right.
  const points = data.map((value, index) => [width - index * step, height - (value / max) * (height - 12) - 6]);
  return (
    <div className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-36 w-full" role="img" aria-label="نمودار خطی">
        <polyline fill="none" stroke={colors[0]} strokeWidth="2.5" points={points.map((point) => point.join(",")).join(" ")} />
        {points.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="3.5" fill={colors[0]} />)}
      </svg>
      <div className="flex flex-row-reverse justify-between text-caption text-muted-foreground" dir="ltr">
        {result.rows.map((row) => <span key={String(row[0])}>{row[0]}</span>)}
      </div>
    </div>
  );
}

export function PieChart({ result }: ChartProps) {
  const data = values(result);
  const total = data.reduce((sum, value) => sum + value, 0) || 1;
  const radius = 15.9155;
  const offsets = data.map((_, index) => data.slice(0, index).reduce((sum, value) => sum + (value / total) * 100, 0));
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 42 42" className="size-36 -rotate-90" role="img" aria-label="نمودار دایره‌ای">
        {data.map((value, index) => {
          const part = (value / total) * 100;
          return <circle key={index} cx="21" cy="21" r={radius} fill="none" stroke={colors[index % colors.length]} strokeWidth="8" strokeDasharray={`${part} ${100 - part}`} strokeDashoffset={-offsets[index]} />;
        })}
      </svg>
      <ul className="flex flex-col gap-1 text-body-sm">
        {result.rows.map((row, index) => (
          <li key={String(row[0])} className="flex items-center gap-2">
            <span className="size-3 rounded-full" style={{ background: colors[index % colors.length] }} />
            {row[0]}: {formatNumber(Math.round((data[index] / total) * 100))}٪
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NumberCard({ result }: ChartProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border bg-muted/40 p-6">
      <span className="text-body-sm text-muted-foreground">{result.columns[0]}</span>
      <span className="text-h1">{formatNumber(Number(result.rows[0]?.[0]) || 0)}</span>
    </div>
  );
}
