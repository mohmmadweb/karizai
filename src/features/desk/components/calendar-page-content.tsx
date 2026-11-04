"use client";

import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiButton } from "@/features/social/components/ai-button";
import { useCalendar } from "@/features/social/components/calendar-provider";
import { dayKey, formatDay, formatTime, monthDays } from "@/features/social/lib/jalali";
import type { CalendarEvent } from "@/features/social/types";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { currentUserId } from "@/features/workspace/lib/people";
import { jalaliParts, monthWeeks } from "../lib/jalali";
import { buildEntries } from "./calendar-entries";
import { CalendarList } from "./calendar-list";
import { CalendarMonth } from "./calendar-month";
import { EventDetailsDialog } from "./event-details-dialog";
import { EventDialog } from "./event-dialog";
import { SuggestTimeDialog } from "./suggest-time-dialog";

/** The first day of the Persian month before or after the one that contains `anchor`. */
function shiftedMonth(anchor: Date, step: 1 | -1): Date {
  const first = monthWeeks(anchor).flat().find((cell) => cell !== null)!.date;
  const next = new Date(first);
  next.setDate(next.getDate() + (step === 1 ? 31 : -1));
  return next;
}

/** My work by date: events, open tasks and project deadlines, as a month grid or as a list. Events live in the shared calendar store. */
export function CalendarPageContent() {
  const { tasks, projects } = useWorkspace();
  const { events, addEvent } = useCalendar();
  const today = useMemo(() => new Date(), []);
  const [anchor, setAnchor] = useState(today);
  const [open, setOpen] = useState<CalendarEvent | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const entries = buildEntries({
    events,
    tasks: tasks.filter((task) => task.assigneeId === currentUserId() && task.status !== "done"),
    projects: projects.filter((project) => project.memberIds.includes(currentUserId()) || project.ownerId === currentUserId()),
  });
  const add = (event: Omit<CalendarEvent, "id">) => {
    addEvent(event);
    toast.success(`«${event.title}» در ${formatDay(event.start)} ساعت ${formatTime(event.start)} به تقویم اضافه شد`);
  };
  const addByHand = (title: string, date: Date) => add({ title, start: date.toISOString(), durationMinutes: 60, place: "" });
  const openEvent = (eventId: string) => setOpen(events.find((event) => event.id === eventId) ?? null);
  const days = monthDays(anchor);
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="تقویم کاری من" description="رویدادها، موعد وظایف و پایان پروژه‌های شما." action={<div className="flex flex-wrap gap-2"><EventDialog key={jalaliParts(anchor).month} anchor={anchor} onAdd={addByHand} /><AiButton label="پیشنهاد زمان جلسه" size="default" onClick={() => setSuggesting(true)} /></div>} />
      <Tabs defaultValue="month">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList><TabsTrigger value="month">تقویم ماهانه</TabsTrigger><TabsTrigger value="list">فهرست موعدها</TabsTrigger></TabsList>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" aria-label="ماه قبل" onClick={() => setAnchor(shiftedMonth(anchor, -1))}><ChevronRightIcon className="rtl:-scale-x-100" aria-hidden /></Button>
            <Button variant="ghost" size="sm" onClick={() => setAnchor(today)}>امروز</Button>
            <Button variant="outline" size="icon-sm" aria-label="ماه بعد" onClick={() => setAnchor(shiftedMonth(anchor, 1))}><ChevronLeftIcon className="rtl:-scale-x-100" aria-hidden /></Button>
          </div>
        </div>
        <TabsContent value="month" className="pt-4"><CalendarMonth entries={entries} anchor={anchor} today={today} onOpen={openEvent} /></TabsContent>
        <TabsContent value="list" className="pt-4"><CalendarList entries={entries} onOpen={openEvent} /></TabsContent>
      </Tabs>
      <EventDetailsDialog event={open} onClose={() => setOpen(null)} />
      <SuggestTimeDialog open={suggesting} onOpenChange={setSuggesting} days={days} events={events} todayKey={dayKey(today)} onBook={add} />
    </div>
  );
}
