"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";
import { jalaliParts, monthWeeks } from "../lib/jalali";

type EventDialogProps = { today: Date; onAdd: (title: string, date: Date) => void };

/** A small form for a new event in this month; it is kept only until the page is reloaded. */
export function EventDialog({ today, onAdd }: EventDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [day, setDay] = useState(jalaliParts(today).day);
  const dates = monthWeeks(today).flat().filter((cell) => cell !== null);
  const submit = () => {
    const chosen = dates.find((cell) => cell.day === day);
    if (!title.trim() || !chosen) return;
    const date = new Date(chosen.date);
    date.setHours(10, 0, 0, 0);
    onAdd(title.trim(), date);
    setTitle("");
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}><PlusIcon aria-hidden />رویداد</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>رویداد تازه</DialogTitle></DialogHeader>
        <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex flex-col gap-4">
          <Field><FieldLabel htmlFor="event-title">عنوان</FieldLabel><Input id="event-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="مثلاً جلسه‌ی فروش" autoFocus /></Field>
          <Field>
            <FieldLabel htmlFor="event-day">روز</FieldLabel>
            <select id="event-day" value={day} onChange={(event) => setDay(Number(event.target.value))} className="h-10 rounded-lg border bg-background px-3 text-body">
              {dates.map((cell) => <option key={cell.day} value={cell.day}>{formatDate(cell.date, { weekday: "long", day: "numeric", month: "long" })}</option>)}
            </select>
          </Field>
          <DialogFooter><Button type="submit" disabled={!title.trim()}>ثبت رویداد</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
