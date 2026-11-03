"use client";

import { useEffect, useRef, useState } from "react";
import type { Indicator } from "../types";

const H = 56;

/**
 * The last 24 hours as a thin line, with the limits dashed. The oldest hour is at the start (right).
 * The drawing is as wide as its box, so it keeps its shape when a card is wide or narrow.
 */
export function Sparkline({ indicator, series }: { indicator: Indicator; series: number[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(240);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setW(Math.max(120, Math.round(entry.contentRect.width))));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { lowerLimit: lo, upperLimit: hi } = indicator;
  const all = [...series, ...[lo, hi].filter((n): n is number => n !== null)];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const y = (n: number) => 4 + (1 - (n - min) / Math.max(max - min, 1e-9)) * (H - 8);
  const x = (i: number) => W - 4 - (i / (series.length - 1)) * (W - 8);
  const points = series.map((n, i) => `${x(i).toFixed(1)},${y(n).toFixed(1)}`).join(" ");
  return (
    <div ref={boxRef} className="flex flex-col gap-1">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="max-w-full" role="img" aria-label="روند ۲۴ ساعت اخیر">
        {[lo, hi].map((limit, i) => (limit === null ? null : <line key={i} x1={0} x2={W} y1={y(limit)} y2={y(limit)} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="4 4" opacity={0.6} />))}
        <polyline points={points} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(series.length - 1)} cy={y(series[series.length - 1])} r={3.5} fill="var(--chart-1)" />
      </svg>
      <div className="flex justify-between text-caption text-muted-foreground" aria-hidden>
        <span>۲۴ ساعت پیش</span>
        <span>اکنون</span>
      </div>
    </div>
  );
}
