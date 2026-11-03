"use client";

import { formatCost } from "@/admin/features/usage-report/lib/format-rows";
import { formatNumber } from "@/admin/lib/format";
import { UPTIME_TARGET } from "../data/telemetry";
import type { KeyFigures as Figures } from "../types";

const percent = (value: number) => `${formatNumber(value, { maximumFractionDigits: 2 })}٪`;

const linkClass =
  "inline-flex min-h-10 w-fit items-center rounded-sm text-body-sm text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

/** The key figures in one strip split by hairlines, with one link to the usage table of the same page instead of one per figure. */
export function KeyFigures({ figures }: { figures: Figures }) {
  const belowTarget = figures.uptime < UPTIME_TARGET;
  const items = [
    { label: "در دسترس‌بودن سامانه", value: percent(figures.uptime), note: belowTarget ? `زیر هدف (هدف ${percent(UPTIME_TARGET)})` : `هدف ${percent(UPTIME_TARGET)}`, warn: belowTarget },
    { label: "نرخ خطا", value: percent(figures.errorRate * 100) },
    { label: "درخواست‌ها", value: formatNumber(figures.requests) },
    { label: "کاربران فعال", value: formatNumber(figures.activeUsers) },
    { label: "توکن‌ها", value: formatNumber(figures.tokens) },
    { label: "هزینه‌ی تقریبی", value: formatCost(figures.cost) },
  ];
  return (
    <div className="flex flex-col gap-2">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <li key={item.label} className="flex flex-col justify-between gap-2 bg-card p-4">
            <span className="text-body-sm text-muted-foreground">{item.label}</span>
            <span className="text-h4 tabular-nums text-foreground">{item.value}</span>
            {item.note ? <span className={item.warn ? "text-caption font-medium text-destructive" : "text-caption text-muted-foreground"}>{item.note}</span> : null}
          </li>
        ))}
      </ul>
      <a
        href="#usage-table"
        className={linkClass}
        onClick={(event) => {
          const target = document.getElementById("usage-table");
          if (!target) return;
          event.preventDefault();
          target.scrollIntoView({ block: "start" });
          target.focus({ preventScroll: true });
        }}
      >
        جدول مصرف
      </a>
    </div>
  );
}
