"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNumber } from "@/lib/format";
import { atTehranTime, formatDay, type CalendarDay } from "../lib/jalali";
import type { CalendarEvent } from "../types";

const times = ["08:00", "09:00", "10:00", "10:30", "11:00", "13:00", "14:00", "15:00", "16:00"];

type NewEventDialogProps = { open: boolean; onOpenChange: (open: boolean) => void; days: CalendarDay[]; onAdd: (event: Omit<CalendarEvent, "id">) => void };

/** «+ رویداد»: title, day of the shown month, time and place. */
export function NewEventDialog({ open, onOpenChange, days, onAdd }: NewEventDialogProps) {
  const [title, setTitle] = useState("");
  const [day, setDay] = useState(days[0]?.key ?? "");
  const [time, setTime] = useState("10:00");
  const [place, setPlace] = useState("");
  const [error, setError] = useState(false);
  const dayItems = days.map((item) => ({ value: item.key, label: formatDay(item.date) }));
  const timeItems = times.map((value) => ({ value, label: formatNumber(Number(value.slice(0, 2))) + ":" + formatNumber(Number(value.slice(3)), { minimumIntegerDigits: 2 }) }));

  function submit(event: FormEvent) {
    event.preventDefault();
    const chosen = days.find((item) => item.key === day) ?? days[0];
    if (!title.trim() || !chosen) return setError(true);
    onAdd({ title: title.trim(), start: atTehranTime(chosen.date, time), durationMinutes: 60, place: place.trim() || "اتاق جلسات ۱" });
    setTitle(""); setPlace(""); onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>رویداد تازه</DialogTitle></DialogHeader>
        <form noValidate onSubmit={submit} className="grid gap-3">
          <Field data-invalid={error || undefined}>
            <FieldLabel htmlFor="ev-title">عنوان</FieldLabel>
            <Input id="ev-title" value={title} onChange={(e) => { setTitle(e.target.value); setError(false); }} placeholder="مثلاً: جلسه‌ی برنامه‌ریزی تولید" aria-invalid={error} />
            {error ? <FieldError>عنوان رویداد را بنویسید.</FieldError> : null}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field><FieldLabel>روز</FieldLabel>
              <Select items={dayItems} value={day} onValueChange={(v) => v && setDay(v)}><SelectTrigger aria-label="روز" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{dayItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
            </Field>
            <Field><FieldLabel>ساعت</FieldLabel>
              <Select items={timeItems} value={time} onValueChange={(v) => v && setTime(v)}><SelectTrigger aria-label="ساعت" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{timeItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
            </Field>
          </div>
          <Field><FieldLabel htmlFor="ev-place">مکان</FieldLabel><Input id="ev-place" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="اتاق جلسات ۱" /></Field>
          <Button type="submit" className="w-fit">افزودن رویداد</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
