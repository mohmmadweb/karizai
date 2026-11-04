"use client";

import Link from "@/components/shared/app-link";
import { CalendarClockIcon, SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { CalendarEvent } from "@/features/social/types";
import { AiAction } from "@/features/social/components/ai-dialog";
import { AiBullets } from "@/features/social/components/ai-parts";
import { qualityAgenda } from "@/features/social/data/ai-answers";
import { dayKey } from "../lib/jalali";
import { DeskPanel } from "./desk-panel";

const endOf = (event: CalendarEvent) => new Date(new Date(event.start).getTime() + event.durationMinutes * 6e4);

function when(event: CalendarEvent): string {
  const start = new Date(event.start);
  const time = formatDate(start, { timeStyle: "short" });
  return dayKey(start) === dayKey(new Date()) ? `امروز · ${time}` : `${formatDate(start, { day: "numeric", month: "long" })} · ${time}`;
}

/** Meetings and events that are on now or still ahead, nearest first. */
export function DeskEvents({ events }: { events: CalendarEvent[] }) {
  const ahead = events.filter((event) => endOf(event) >= new Date()).sort((a, b) => a.start.localeCompare(b.start)).slice(0, 4);
  return (
    <DeskPanel tone="violet" title="رویدادهای در حال برگزاری" icon={CalendarClockIcon} href="/calendar" linkLabel="مشاهده‌ی همه" empty="رویدادی در پیش ندارید." isEmpty={ahead.length === 0}>
      {ahead.map((event) => (
        <li key={event.id} className="flex items-start justify-between gap-3 py-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-label">{event.title}</span>
            <span className="text-body-sm text-muted-foreground">{when(event)} · {event.place}</span>
          </div>
          {event.agenda ? <AiAction label="دستور جلسه" context={event.title}><AiBullets items={qualityAgenda} /></AiAction>
            : event.hasMinutes ? <Link href="/calendar" className="shrink-0"><Badge variant="secondary" className="gap-1"><SparklesIcon className="size-3" aria-hidden />صورت‌جلسه و وظایف</Badge></Link> : null}
        </li>
      ))}
    </DeskPanel>
  );
}
