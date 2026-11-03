const W = 120;
const H = 40;

/** A thin trend line of the last weeks with the target dashed. The oldest week is at the start (right). */
export function AreaSparkline({ series, target, label }: { series: number[]; target: number; label: string }) {
  const all = [...series, target];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const y = (n: number) => 4 + (1 - (n - min) / Math.max(max - min, 1e-9)) * (H - 8);
  const x = (i: number) => W - 3 - (i / (series.length - 1)) * (W - 6);
  const points = series.map((n, i) => `${x(i).toFixed(1)},${y(n).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-10 w-full" role="img" aria-label={label}>
      <line x1={0} x2={W} y1={y(target)} y2={y(target)} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} vectorEffect="non-scaling-stroke" />
      <polyline points={points} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={x(series.length - 1)} cy={y(series[series.length - 1])} r={3} fill="var(--chart-1)" />
    </svg>
  );
}
