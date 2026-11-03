"use client";

import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { daysFromToday, demoToday } from "@/features/workspace/lib/today";
import { AiButton } from "../components/ai-button";
import { getEvents } from "../data/calendar";
import { dayKey, formatDay, formatMonth, formatTime, monthDays, shiftMonth } from "../lib/jalali";
import type { CalendarEvent } from "../types";
import { EventDialog } from "./event-dialog";
import { MonthGrid } from "./month-grid";
import { NewEventDialog } from "./new-event-dialog";
import { SuggestTimeDialog } from "./suggest-time-dialog";

/** «تقویم کاری من»: the Jalali month with events; recorded meetings get minutes and tasks. Changes stay until reload. */
export function CalendarPageContent() {
  const [anchor, setAnchor] = useState(() => new Date(demoToday));
  const [events, setEvents] = useState(getEvents);
  const [open, setOpen] = useState<CalendarEvent | null>(null);
  const [adding, setAdding] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const counter = useRef(0);
  const days = monthDays(anchor);
  const todayKey = dayKey(demoToday);
  const keys = new Set(days.map((day) => day.key));
  const inMonth = events.filter((event) => keys.has(dayKey(event.start))).sort((a, b) => a.start.localeCompare(b.start));
  const add = (event: Omit<CalendarEvent, "id">) => {
    setEvents((list) => [...list, { ...event, id: `ev-new-${++counter.current}` }]);
    toast.success(`«${event.title}» در ${formatDay(event.start)} ساعت ${formatTime(event.start)} به تقویم اضافه شد`);
  };

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="تقویم کاری من" description="جلسه‌ها و رویدادهای شما و همکاران" action={
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setAdding(true)}><PlusIcon data-icon="inline-start" aria-hidden />رویداد</Button>
          <AiButton label="پیشنهاد زمان جلسه" size="default" onClick={() => setSuggesting(true)} />
        </div>
      } />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-sm" aria-label="ماه قبل" onClick={() => setAnchor(shiftMonth(anchor, -1))}><ChevronRightIcon className="rtl:-scale-x-100" aria-hidden /></Button>
        <h2 className="min-w-32 text-center text-h4" aria-live="polite">{formatMonth(days[0].date)}</h2>
        <Button variant="outline" size="icon-sm" aria-label="ماه بعد" onClick={() => setAnchor(shiftMonth(anchor, 1))}><ChevronLeftIcon className="rtl:-scale-x-100" aria-hidden /></Button>
        <Button variant="ghost" size="sm" onClick={() => setAnchor(new Date(demoToday))}>امروز</Button>
      </div>
      <MonthGrid days={days} events={events} todayKey={todayKey} onOpen={setOpen} />
      <section aria-labelledby="month-events" className="flex flex-col gap-2">
        <h2 id="month-events" className="text-h4">رویدادهای این ماه</h2>
        {inMonth.length === 0 ? <p className="text-body-sm text-muted-foreground">رویدادی در این ماه نیست.</p> : (
          <ul className="flex flex-col gap-2">
            {inMonth.map((event) => (
              <li key={event.id}>
                <button type="button" onClick={() => setOpen(event)} className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border bg-card p-3 text-start outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50">
                  <span className="w-28 text-body-sm text-muted-foreground">{formatDay(event.start)} · {formatTime(event.start)}</span>
                  <span className="flex-1 text-label">{event.suggested ? "✦ " : ""}{event.title}</span>
                  <span className="text-body-sm text-muted-foreground">{event.place}</span>
                  {event.hasMinutes ? <span className="text-caption text-primary">✦ {daysFromToday(event.start) < 0 ? "صورت‌جلسه آماده است" : "صورت‌جلسه و وظایف"}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="text-body-sm text-muted-foreground"><span aria-hidden className="text-primary">✦ </span>جلسه‌های ضبط‌شده یا دارای یادداشت، صورت‌جلسه و وظایف خودکار می‌گیرند.</p>
      <EventDialog event={open} onClose={() => setOpen(null)} />
      <NewEventDialog key={days[0].key} open={adding} onOpenChange={setAdding} days={days} onAdd={add} />
      <SuggestTimeDialog open={suggesting} onOpenChange={setSuggesting} days={days} events={events} todayKey={todayKey} onBook={add} />
    </div>
  );
}
