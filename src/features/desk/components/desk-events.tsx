"use client";

import Link from "next/link";
import { CalendarClockIcon, SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { DeskEvent } from "../data/events";
import { dayKey } from "../lib/jalali";
import { DeskPanel } from "./desk-panel";

function when(event: DeskEvent): string {
  const start = new Date(event.startsAt);
  const time = formatDate(start, { timeStyle: "short" });
  return dayKey(start) === dayKey(new Date()) ? `امروز · ${time}` : `${formatDate(start, { day: "numeric", month: "long" })} · ${time}`;
}

/** Meetings and events that are on now or still ahead, nearest first. */
export function DeskEvents({ events }: { events: DeskEvent[] }) {
  const ahead = events.filter((event) => new Date(event.endsAt) >= new Date()).sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, 4);
  return (
    <DeskPanel tone="violet" title="رویدادهای در حال برگزاری" icon={CalendarClockIcon} href="/calendar" linkLabel="مشاهده‌ی همه" empty="رویدادی در پیش ندارید." isEmpty={ahead.length === 0}>
      {ahead.map((event) => (
        <li key={event.id} className="flex items-start justify-between gap-3 py-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-label">{event.title}</span>
            <span className="text-body-sm text-muted-foreground">{when(event)} · {event.place}</span>
          </div>
          {event.assistant ? <Link href="/calendar" className="shrink-0"><Badge variant="secondary" className="gap-1"><SparklesIcon className="size-3" aria-hidden />{event.assistant.label}</Badge></Link> : null}
        </li>
      ))}
    </DeskPanel>
  );
}
