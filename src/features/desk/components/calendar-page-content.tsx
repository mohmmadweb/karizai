"use client";

import { useMemo, useState } from "react";
import { SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { currentUserId } from "@/features/workspace/lib/people";
import { formatDate } from "@/lib/format";
import { getEvents, type DeskEvent } from "../data/events";
import { buildEntries, type CalendarEntry } from "./calendar-entries";
import { CalendarList } from "./calendar-list";
import { CalendarMonth } from "./calendar-month";
import { EventDialog } from "./event-dialog";

/** My work by date: events, open tasks and project deadlines, as a month grid or as a list. */
export function CalendarPageContent() {
  const { tasks, projects } = useWorkspace();
  const today = useMemo(() => new Date(), []);
  const [events, setEvents] = useState<DeskEvent[]>(() => getEvents());
  const [suggestions, setSuggestions] = useState<CalendarEntry[]>([]);
  const entries = buildEntries({
    events,
    tasks: tasks.filter((task) => task.assigneeId === currentUserId() && task.status !== "done"),
    projects: projects.filter((project) => project.memberIds.includes(currentUserId()) || project.ownerId === currentUserId()),
    suggestions,
  });
  const addEvent = (title: string, date: Date) => setEvents((list) => [...list, { id: `evt-new-${list.length + 1}`, title, startsAt: date.toISOString(), endsAt: new Date(date.getTime() + 36e5).toISOString(), place: "" }]);
  const suggest = () => {
    const date = new Date(today);
    date.setDate(date.getDate() + 7);
    date.setHours(10, 0, 0, 0);
    setSuggestions([{ id: "suggest-1", date: date.toISOString(), title: "پیشنهاد زمان: جلسه‌ی فروش", kind: "suggestion" }]);
    toast.success("زمان پیشنهادی ثبت شد", { description: `${formatDate(date, { weekday: "long", day: "numeric", month: "long" })}، ساعت ${formatDate(date, { timeStyle: "short" })} برای همه‌ی شرکت‌کنندگان خالی است.` });
  };
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="تقویم کاری من" description="رویدادها، موعد وظایف و پایان پروژه‌های شما." action={<div className="flex flex-wrap gap-2"><EventDialog today={today} onAdd={addEvent} /><Button variant="outline" onClick={suggest}><SparklesIcon aria-hidden />پیشنهاد زمان جلسه</Button></div>} />
      <Tabs defaultValue="month">
        <TabsList><TabsTrigger value="month">تقویم ماهانه</TabsTrigger><TabsTrigger value="list">فهرست موعدها</TabsTrigger></TabsList>
        <TabsContent value="month" className="pt-4"><CalendarMonth entries={entries} today={today} /></TabsContent>
        <TabsContent value="list" className="pt-4"><CalendarList entries={entries} /></TabsContent>
      </Tabs>
    </div>
  );
}
