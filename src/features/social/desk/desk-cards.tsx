"use client";

import Link from "next/link";
import { CalendarDaysIcon, FlaskConicalIcon, ListChecksIcon, MessageSquareTextIcon, ThermometerIcon, UsersRoundIcon } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChat } from "@/features/chat/components/chat-provider";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { currentUserId } from "@/features/workspace/lib/people";
import { daysFromToday } from "@/features/workspace/lib/today";
import { formatDate, formatNumber } from "@/lib/format";
import { AiAction } from "../components/ai-dialog";
import { AiBullets } from "../components/ai-parts";
import { BatchAnalysis } from "../components/batch-analysis";
import { qualityAgenda } from "../data/ai-answers";
import { getEvents } from "../data/calendar";
import { getGroups } from "../data/groups";
import { GroupSummaryAnswer } from "../groups/group-summary-answer";
import { formatDay, formatTime } from "../lib/jalali";

const seeAll = (href: string) => <CardAction><Link href={href} className="text-body-sm text-primary hover:underline">مشاهده‌ی همه</Link></CardAction>;
const row = "flex items-center gap-3 py-3 first:pt-0 last:pb-0";
const icon = "flex size-9 shrink-0 items-center justify-center rounded-xl";

/** «رویدادهای در حال برگزاری»: today's and the next few days' events; the quality review has its agenda. */
export function DeskEvents() {
  const events = getEvents().filter((event) => daysFromToday(event.start) >= 0 && daysFromToday(event.start) <= 3);
  return (
    <Card>
      <CardHeader><CardTitle>رویدادهای در حال برگزاری</CardTitle>{seeAll("/calendar")}</CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y">
          {events.map((event) => (
            <li key={event.id} className={row}>
              <span aria-hidden className={`${icon} bg-info/10 text-info`}><CalendarDaysIcon className="size-5" /></span>
              <div className="min-w-0 flex-1"><p className="text-label">{event.title}</p><p className="text-body-sm text-muted-foreground">{daysFromToday(event.start) === 0 ? "امروز" : formatDay(event.start)} {formatTime(event.start)} · {event.place}</p></div>
              {event.id === "ev-2" ? <AiAction label="دستور جلسه" context={event.title}><AiBullets items={qualityAgenda} /></AiAction> : null}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/** «گروه‌های من» with a «✦ خلاصه» for each. */
export function DeskGroups() {
  return (
    <Card>
      <CardHeader><CardTitle>گروه‌های من</CardTitle>{seeAll("/messenger/groups")}</CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y">
          {getGroups().slice(0, 3).map((group) => (
            <li key={group.id} className={row}>
              <span aria-hidden className={`${icon} bg-primary/10 text-primary`}><UsersRoundIcon className="size-5" /></span>
              <div className="min-w-0 flex-1"><p className="text-label">{group.name}</p><p className="text-body-sm text-muted-foreground">{group.summary.unread > 0 ? `${formatNumber(group.summary.unread)} پیام خوانده‌نشده` : "همه خوانده شده"}</p></div>
              <AiAction label="خلاصه" context={`گروه ${group.name}`}><GroupSummaryAnswer group={group} /></AiAction>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/** «✦ هشدارهای جریان‌ها»: what the Agents found on the line and in the lab. */
export function DeskAlerts() {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-1.5"><span aria-hidden className="text-primary">✦</span>هشدارهای جریان‌ها</CardTitle>{seeAll("/messenger/alerts")}</CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y">
          <li className={row}>
            <span aria-hidden className={`${icon} bg-warning/25 text-warning-foreground dark:text-warning`}><ThermometerIcon className="size-5" /></span>
            <div className="min-w-0 flex-1"><p className="text-label">دمای ناحیه‌ی ۴ اکسترودر خارج از حد</p><p className="text-body-sm text-muted-foreground">۲۴۸ درجه (حد ۲۴۰) · ضایعات ۴٫۸٪ · علت احتمالی: حسگر یا تنظیم گرمکن</p></div>
          </li>
          <li className={row}>
            <span aria-hidden className={`${icon} bg-destructive/10 text-destructive`}><FlaskConicalIcon className="size-5" /></span>
            <div className="min-w-0 flex-1"><p className="text-label">بچ B-1405-2217 مردود شد</p><p className="text-body-sm text-muted-foreground">اختلاف رنگ ΔE ۲٫۹ · تحلیل علت آماده است</p></div>
            <AiAction label="مشاهده‌ی تحلیل" context="بچ B-1405-2217"><BatchAnalysis /></AiAction>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

/** «وظایف باز من»: the user's open tasks, earliest due first. */
export function DeskTasks() {
  const { tasks } = useWorkspace();
  const mine = tasks.filter((task) => task.assigneeId === currentUserId() && task.status !== "done").sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return (
    <Card>
      <CardHeader><CardTitle>وظایف باز من</CardTitle>{seeAll("/messenger/tasks")}</CardHeader>
      <CardContent>
        {mine.length === 0 ? <p className="text-body-sm text-muted-foreground">وظیفه‌ی بازی ندارید.</p> : (
          <ul className="flex flex-col divide-y">
            {mine.slice(0, 4).map((task) => (
              <li key={task.id} className={row}>
                <span aria-hidden className={`${icon} bg-success/10 text-success`}><ListChecksIcon className="size-5" /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-label">{task.title}</p><p className="text-body-sm text-muted-foreground">موعد: {formatDate(task.dueDate)}</p></div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/** «گفتگوهای اخیر» with the assistant. */
export function DeskChats() {
  const { state } = useChat();
  const recent = state.conversations.slice(0, 4);
  return (
    <Card>
      <CardHeader><CardTitle>گفتگوهای اخیر</CardTitle>{seeAll("/chat")}</CardHeader>
      <CardContent>
        {recent.length === 0 ? <p className="text-body-sm text-muted-foreground">هنوز گفتگویی ندارید.</p> : (
          <ul className="flex flex-col divide-y">
            {recent.map((item) => (
              <li key={item.id} className={row}>
                <span aria-hidden className={`${icon} bg-primary/10 text-primary`}><MessageSquareTextIcon className="size-5" /></span>
                <Link href={`/chat/${item.id}`} className="min-w-0 flex-1 truncate rounded-md text-label outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">{item.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
