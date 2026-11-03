"use client";

import { useState } from "react";
import { formatNumber, formatPercent } from "@/admin/lib/format";
import { cn } from "@/lib/utils";

export type DonutSlice = { id: string; label: string; value: number };

const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--muted-foreground)"];
export const sliceColor = (index: number) => colors[index % colors.length];

type Props = { slices: DonutSlice[]; unit: string; ariaLabel: string; centerLabel: string; className?: string };

const R = 70;
const C = 2 * Math.PI * R;

/** Donut in SVG with a legend that repeats every value, so colour is never the only cue. */
export function DonutChart({ slices, unit, ariaLabel, centerLabel, className }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const total = slices.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const shown = slices.find((s) => s.id === active);
  return (
    <figure className={cn("flex flex-col items-center gap-5 sm:flex-row", className)}>
      <svg viewBox="0 0 200 200" width={200} height={200} role="img" aria-label={ariaLabel} className="shrink-0 -rotate-90">
        <circle cx={100} cy={100} r={R} fill="none" stroke="var(--border)" strokeWidth={26} />
        {total > 0 && slices.map((s, i) => {
          const len = (s.value / total) * C;
          const el = (
            <circle
              key={s.id} cx={100} cy={100} r={R} fill="none" stroke={sliceColor(i)}
              strokeWidth={active === s.id ? 30 : 26}
              strokeDasharray={`${Math.max(0, len - 1.5)} ${C}`}
              strokeDashoffset={-offset}
              onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}
            />
          );
          offset += len;
          return el;
        })}
        <g transform="rotate(90 100 100)" fill="currentColor" textAnchor="middle" className="text-foreground">
          <text x={100} y={96} fontSize={15} fontWeight={600}>{formatNumber(Math.round(shown ? shown.value : total))}</text>
          <text x={100} y={116} fontSize={10} className="fill-muted-foreground">{shown ? shown.label : centerLabel}</text>
        </g>
      </svg>
      <figcaption className="w-full min-w-0 flex-1">
        <ul className="flex flex-col gap-2">
          {slices.map((s, i) => (
            <li
              key={s.id} tabIndex={0}
              className="flex items-center gap-2 rounded-md text-body-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(s.id)} onBlur={() => setActive(null)}
            >
              <span aria-hidden className="size-2.5 shrink-0 rounded-sm" style={{ background: sliceColor(i) }} />
              <span className="min-w-0 flex-1 truncate text-foreground">{s.label}</span>
              <span className="text-muted-foreground tabular-nums">{formatNumber(Math.round(s.value))} {unit}</span>
              <span className="w-12 text-end text-muted-foreground tabular-nums">{formatPercent(total > 0 ? s.value / total : 0)}</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
