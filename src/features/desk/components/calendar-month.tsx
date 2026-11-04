"use client";

import { SparklesIcon } from "lucide-react";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { dayKey, jalaliParts, monthWeeks } from "../lib/jalali";
import type { CalendarEntry } from "./calendar-entries";

const weekdays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
const shortNames: Record<string, string> = { "شنبه": "ش", "یکشنبه": "ی", "دوشنبه": "د", "سه‌شنبه": "س", "چهارشنبه": "چ", "پنجشنبه": "پ", "جمعه": "ج" };

/** The month as a grid, Saturday first. Each day lists what is dated on it. */
export function CalendarMonth({ entries, anchor, today, onOpen }: { entries: CalendarEntry[]; anchor: Date; today: Date; onOpen: (eventId: string) => void }) {
  const weeks = monthWeeks(anchor);
  const byDay = new Map<string, CalendarEntry[]>();
  for (const entry of entries) byDay.set(dayKey(new Date(entry.date)), [...(byDay.get(dayKey(new Date(entry.date))) ?? []), entry]);
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-h4">{formatDate(anchor, { month: "long", year: "numeric" })}</h2>
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full table-fixed sm:min-w-176 border-collapse">
          <thead>
            <tr>{weekdays.map((name) => <th key={name} scope="col" className="bg-primary px-0.5 py-2 text-caption text-primary-foreground sm:px-2 sm:py-2.5 sm:text-label"><span className="sm:hidden">{shortNames[name]}</span><span className="hidden sm:inline">{name}</span></th>)}</tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => (
              <tr key={index}>
                {week.map((cell, column) => {
                  if (!cell) return <td key={column} className="h-14 border bg-muted/30 sm:h-28" />;
                  const items = byDay.get(dayKey(cell.date)) ?? [];
                  const isToday = dayKey(cell.date) === dayKey(today);
                  return (
                    <td key={column} className={cn("h-14 border p-0.5 align-top sm:h-28 sm:p-1.5", isToday && "bg-primary/5")}>
                      <span className={cn("mx-auto mb-1 flex size-6 items-center justify-center rounded-full text-body-sm sm:mx-0", isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{jalaliParts(cell.date).day.toLocaleString("fa-IR")}</span>
                      {items.length > 0 ? (
                        <div className="flex flex-wrap items-center justify-center gap-0.5 sm:hidden" aria-label={`${items.length.toLocaleString("fa-IR")} مورد`}>
                          {items.slice(0, 3).map((entry) => <span key={entry.id} className={cn("size-1.5 rounded-full", entry.kind === "suggestion" || entry.assistant ? "bg-primary" : "bg-muted-foreground")} />)}
                          {items.length > 3 ? <span className="text-[10px] leading-none text-muted-foreground">+</span> : null}
                        </div>
                      ) : null}
                      <ul className="hidden flex-col gap-1 sm:flex">
                        {items.slice(0, 3).map((entry) => (
                          <li key={entry.id}>
                            {(() => {
                              const cls = cn("block w-full truncate rounded-md px-1.5 py-0.5 text-start text-caption", entry.kind === "suggestion" || entry.assistant ? "bg-primary/10 text-primary" : "bg-muted");
                              const label = <>{entry.kind === "suggestion" ? <SparklesIcon className="me-1 inline size-3" aria-hidden /> : null}<bdi>{entry.title}</bdi></>;
                              return entry.eventId
                                ? <button type="button" title={entry.title} onClick={() => onOpen(entry.eventId!)} className={cn(cls, "outline-none hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-ring/50")}>{label}</button>
                                : <span title={entry.title} className={cls}>{label}</span>;
                            })()}
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
