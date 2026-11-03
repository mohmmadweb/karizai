"use client";

import { dayKey, weekdayNames, type CalendarDay } from "../lib/jalali";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "../types";

type MonthGridProps = { days: CalendarDay[]; events: CalendarEvent[]; todayKey: string; onOpen: (event: CalendarEvent) => void };

/** The Jalali month, Saturday first; each event is a button that opens it. */
export function MonthGrid({ days, events, todayKey, onOpen }: MonthGridProps) {
  const blanks = days[0]?.weekday ?? 0;
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="grid grid-cols-7 border-b bg-muted/50 text-center text-caption text-muted-foreground" aria-hidden>
        {weekdayNames.map((name) => <div key={name} className="py-2">{name}</div>)}
      </div>
      <ol className="grid grid-cols-7">
        {Array.from({ length: blanks }, (_, index) => <li key={`b${index}`} aria-hidden className="min-h-20 border-b border-e bg-muted/20 sm:min-h-24" />)}
        {days.map((day) => {
          const list = events.filter((event) => dayKey(event.start) === day.key);
          const today = day.key === todayKey;
          return (
            <li key={day.key} className={cn("flex min-h-20 flex-col gap-1 border-b border-e p-1 sm:min-h-24 sm:p-1.5", day.weekday === 6 && "bg-muted/30")}>
              <span className={cn("flex size-6 items-center justify-center rounded-full text-caption tabular-nums", today && "bg-primary text-primary-foreground")} aria-current={today ? "date" : undefined}>{formatNumber(day.day)}</span>
              {list.map((event) => (
                <button key={event.id} type="button" onClick={() => onOpen(event)} className={cn("truncate rounded px-1 py-0.5 text-start text-[11px] leading-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:text-caption", event.suggested ? "border border-dashed border-primary/40 bg-primary/5 text-primary" : "bg-info/10 text-info hover:bg-info/20")}>
                  {event.suggested ? "✦ " : ""}{event.title}
                </button>
              ))}
              {list.some((event) => event.hasMinutes) ? <span className="truncate text-[11px] text-primary sm:text-caption">✦ صورت‌جلسه</span> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
