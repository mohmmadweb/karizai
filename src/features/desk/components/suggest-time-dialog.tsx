"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AiDialog } from "@/features/social/components/ai-dialog";
import { atTehranTime, dayKey, formatDay, formatTime, type CalendarDay } from "@/features/social/lib/jalali";
import type { CalendarEvent } from "@/features/social/types";

type SuggestTimeDialogProps = { open: boolean; onOpenChange: (open: boolean) => void; days: CalendarDay[]; events: CalendarEvent[]; todayKey: string; onBook: (event: Omit<CalendarEvent, "id">) => void };

const slotTimes = ["09:00", "11:00", "14:00"];

/** «✦ پیشنهاد زمان جلسه»: the next three working days without events, at times when everyone is free. */
export function SuggestTimeDialog({ open, onOpenChange, days, events, todayKey, onBook }: SuggestTimeDialogProps) {
  const [title, setTitle] = useState("جلسه‌ی فروش");
  const busy = new Set(events.map((event) => dayKey(event.start)));
  const start = Math.max(0, days.findIndex((day) => day.key === todayKey) + 1);
  const free = days.slice(start).filter((day) => day.weekday !== 6 && !busy.has(day.key)).slice(0, 3);
  const slots = free.map((day, index) => atTehranTime(day.date, slotTimes[index % slotTimes.length]));
  return (
    <AiDialog open={open} onOpenChange={onOpenChange} title="پیشنهاد زمان جلسه" context="تقویم شما و شرکت‌کنندگان">
      {(close) => (
        <div className="flex flex-col gap-3">
          <Field><FieldLabel htmlFor="slot-title">موضوع جلسه</FieldLabel><Input id="slot-title" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          {slots.length === 0 ? <p>در این ماه روز آزادی پیدا نشد؛ ماه بعد را ببینید.</p> : (
            <ul className="flex flex-col gap-2">
              {slots.map((slot) => (
                <li key={slot} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-2.5">
                  <span><span className="text-label">{formatDay(slot)} · ساعت {formatTime(slot)}</span><span className="block text-caption text-muted-foreground">همه آزادند؛ پیش و پس از آن جلسه‌ای ندارید.</span></span>
                  <Button size="xs" onClick={() => { onBook({ title: title.trim() || "جلسه", start: slot, durationMinutes: 60, place: "اتاق جلسات ۲", suggested: true }); close(); }}>رزرو این زمان</Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </AiDialog>
  );
}
