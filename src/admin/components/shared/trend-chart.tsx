"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/admin/lib/format";
import { cn } from "@/lib/utils";

export type TrendSeries = {
  key: string;
  label: string;
  values: number[];
  /** Chart token to paint with. */
  color: "chart-1" | "chart-2" | "chart-3";
};

type TrendChartProps = {
  /** One label per bar, oldest first. */
  labels: string[];
  /** Series are stacked in the given order. */
  series: TrendSeries[];
  /** Short unit text for captions, such as «درخواست» or «توکن». */
  unit: string;
  /** Names the whole chart for assistive technology. */
  ariaLabel: string;
  className?: string;
};

const H = 220;
const PAD = { top: 10, bottom: 26, start: 8, end: 52 };

const fill = { "chart-1": "var(--chart-1)", "chart-2": "var(--chart-2)", "chart-3": "var(--chart-3)" };

function niceMax(max: number) {
  if (max <= 0) return 1;
  const exp = 10 ** Math.floor(Math.log10(max));
  const f = max / exp;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * exp;
}

/**
 * Stacked bars in SVG, no library. The time axis runs from the start (right)
 * edge, as Persian is read. Every bar can be focused to read its value.
 */
export function TrendChart({ labels, series, unit, ariaLabel, className }: TrendChartProps) {
  const [active, setActive] = useState<number | null>(null);
  // The drawing is as wide as its box, so labels keep their real size on phones.
  const boxRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(640);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setW(Math.max(260, Math.round(entry.contentRect.width)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const count = labels.length;
  const totals = labels.map((_, i) => series.reduce((s, x) => s + (x.values[i] ?? 0), 0));
  const top = niceMax(Math.max(0, ...totals));
  const plotW = W - PAD.start - PAD.end;
  const plotH = H - PAD.top - PAD.bottom;
  const step = plotW / Math.max(count, 1);
  const barW = Math.max(2, step * 0.62);
  const xOf = (i: number) => W - PAD.end - (i + 1) * step + (step - barW) / 2;
  const every = Math.max(1, Math.ceil(count / Math.max(3, Math.floor(plotW / 64))));
  const peak = totals.indexOf(Math.max(...totals));
  const shown = active ?? (count > 0 ? peak : null);

  const caption =
    shown === null
      ? ""
      : `${labels[shown]}: ${series
          .map((s) => `${formatNumber(s.values[shown] ?? 0)} ${series.length > 1 ? s.label : unit}`)
          .join("، ")}`;

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <figcaption className="text-body-sm text-foreground" aria-live="polite">
          {caption}
          {active === null && count > 0 ? (
            <span className="text-muted-foreground"> (بیشترین مقدار)</span>
          ) : null}
        </figcaption>
        {series.length > 1 ? (
          <ul className="flex items-center gap-4 text-caption text-muted-foreground">
            {series.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span aria-hidden className="size-2.5 rounded-sm" style={{ background: fill[s.color] }} />
                {s.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div ref={boxRef} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="group"
        aria-label={ariaLabel}
        className="block text-muted-foreground"
        onMouseLeave={() => setActive(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const y = PAD.top + plotH * (1 - f);
          return (
            <g key={f}>
              <line x1={PAD.start} x2={W - PAD.end} y1={y} y2={y} stroke="var(--border)" strokeWidth={1} />
              <text x={W - PAD.end + 6} y={y + 4} fontSize={11} fill="currentColor" textAnchor="start">
                {formatNumber(Math.round(top * f))}
              </text>
            </g>
          );
        })}
        {labels.map((label, i) => {
          let y = PAD.top + plotH;
          return (
            <g
              key={label + i}
              tabIndex={0}
              role="img"
              aria-label={`${label}: ${formatNumber(totals[i])} ${unit}`}
              className="outline-none focus-visible:[&>rect:first-child]:stroke-ring"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <rect
                x={xOf(i) - 2}
                y={PAD.top}
                width={barW + 4}
                height={plotH}
                fill={shown === i ? "var(--accent)" : "transparent"}
                stroke="transparent"
                strokeWidth={2}
                rx={3}
              />
              {series.map((s) => {
                const h = (plotH * (s.values[i] ?? 0)) / top;
                y -= h;
                return h > 0 ? (
                  <rect key={s.key} x={xOf(i)} y={y} width={barW} height={h} rx={1.5} fill={fill[s.color]} />
                ) : null;
              })}
              {i % every === 0 ? (
                <text
                  x={xOf(i) + barW / 2}
                  y={H - 8}
                  fontSize={11}
                  fill="currentColor"
                  textAnchor="middle"
                >
                  {label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      </div>
    </figure>
  );
}
