"use client";

import { SparklesIcon } from "lucide-react";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { dayKey, jalaliParts, monthWeeks } from "../lib/jalali";
import type { CalendarEntry } from "./calendar-entries";

const weekdays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

/** The month as a grid, Saturday first. Each day lists what is dated on it. */
export function CalendarMonth({ entries, today }: { entries: CalendarEntry[]; today: Date }) {
  const weeks = monthWeeks(today);
  const byDay = new Map<string, CalendarEntry[]>();
  for (const entry of entries) byDay.set(dayKey(new Date(entry.date)), [...(byDay.get(dayKey(new Date(entry.date))) ?? []), entry]);
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-h4">{formatDate(today, { month: "long", year: "numeric" })}</h2>
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full min-w-176 table-fixed border-collapse">
          <thead>
            <tr>{weekdays.map((name) => <th key={name} scope="col" className="bg-primary px-2 py-2.5 text-label text-primary-foreground">{name}</th>)}</tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => (
              <tr key={index}>
                {week.map((cell, column) => {
                  if (!cell) return <td key={column} className="h-28 border bg-muted/30" />;
                  const items = byDay.get(dayKey(cell.date)) ?? [];
                  const isToday = dayKey(cell.date) === dayKey(today);
                  return (
                    <td key={column} className={cn("h-28 border p-1.5 align-top", isToday && "bg-primary/5")}>
                      <span className={cn("mb-1 flex size-6 items-center justify-center rounded-full text-body-sm", isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{jalaliParts(cell.date).day.toLocaleString("fa-IR")}</span>
                      <ul className="flex flex-col gap-1">
                        {items.slice(0, 3).map((entry) => (
                          <li key={entry.id} title={entry.title} className={cn("truncate rounded-md px-1.5 py-0.5 text-caption", entry.kind === "suggestion" || entry.assistant ? "bg-primary/10 text-primary" : "bg-muted")}>
                            {entry.kind === "suggestion" ? <SparklesIcon className="me-1 inline size-3" aria-hidden /> : null}{entry.title}
                          </li>
                        ))}
                        {items.length > 3 ? <li className="px-1 text-caption text-muted-foreground">+{(items.length - 3).toLocaleString("fa-IR")} مورد دیگر</li> : null}
                      </ul>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="flex items-center gap-1.5 text-caption text-muted-foreground"><SparklesIcon className="size-3.5" aria-hidden />رویدادهای دارای نشان دستیار، صورت‌جلسه یا دستور جلسه‌ی آماده دارند.</p>
    </div>
  );
}
