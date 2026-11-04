"use client";

import { useState } from "react";
import { formatNumber } from "@/admin/lib/format";
import { formatCost } from "../lib/format-rows";
import type { ShareSlice } from "../lib/group-share";

const SIZE = 200;
const C = SIZE / 2;
const R = 90;
const INNER = 56;

function arc(start: number, end: number) {
  const a0 = start * 2 * Math.PI - Math.PI / 2;
  const a1 = Math.min(end, 0.9999) * 2 * Math.PI - Math.PI / 2;
  const p = (r: number, a: number) => `${C + r * Math.cos(a)} ${C + r * Math.sin(a)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p(R, a0)} A ${R} ${R} 0 ${large} 1 ${p(R, a1)} L ${p(INNER, a1)} A ${INNER} ${INNER} 0 ${large} 0 ${p(INNER, a0)} Z`;
}

const percentText = (value: number) => `${formatNumber(value, { maximumFractionDigits: 1 })}٪`;

type Props = { slices: ShareSlice[]; all: ShareSlice[]; multiGroupNote: boolean };

/** Donut in SVG. Slices are focusable and the list beside it repeats every value as text. */
export function GroupShareChart({ slices, all, multiGroupNote }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const current = slices.find((s) => s.id === active);
  const starts = slices.map((_, i) => slices.slice(0, i).reduce((sum, x) => sum + x.percent / 100, 0));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative size-48 shrink-0">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="group" aria-label="سهم هر گروه از مصرف" className="size-full">
            {slices.map((s, i) => {
              const start = starts[i];
              return (
                <path
                  key={s.id}
                  d={arc(start, start + s.percent / 100)}
                  fill={s.color}
                  stroke="var(--card)"
                  strokeWidth={2}
                  tabIndex={0}
                  role="img"
                  aria-label={`${s.name}، ${formatNumber(s.tokens)} توکن، ${percentText(s.percent)}`}
                  className="outline-none focus-visible:stroke-foreground"
                  onMouseEnter={() => setActive(s.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(s.id)}
                  onBlur={() => setActive(null)}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-h4 tabular-nums text-foreground">{current ? percentText(current.percent) : formatNumber(all.length)}</span>
            <span className="max-w-24 truncate text-caption text-muted-foreground">{current ? current.name : "گروه دارای مصرف"}</span>
          </div>
        </div>
        <ul className="flex min-w-0 flex-1 flex-col gap-2 self-stretch">
          {all.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm">
              <span aria-hidden className="size-3 shrink-0 rounded-sm" style={{ background: slices.some((x) => x.id === s.id) ? s.color : "var(--muted-foreground)" }} />
              <span className="min-w-24 font-medium text-foreground">{s.name}</span>
              <span className="w-14 tabular-nums text-foreground">{percentText(s.percent)}</span>
              <span className="tabular-nums text-muted-foreground">{formatNumber(s.tokens)} توکن</span>
              <span className="tabular-nums text-muted-foreground">{formatCost(s.cost)}</span>
            </li>
          ))}
        </ul>
      </div>
      {multiGroupNote ? (
        <p className="text-caption text-muted-foreground">
          مصرف کاربری که عضو چند گروه است برای هر گروه شمرده می‌شود؛ پس مجموع گروه‌ها ممکن است از مصرف کل بیشتر باشد.
        </p>
      ) : null}
    </div>
  );
}
