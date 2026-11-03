"use client";

import Link from "next/link";
import { CalendarDaysIcon, FlaskConicalIcon, ThermometerIcon, UsersRoundIcon } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { daysFromToday } from "@/features/workspace/lib/today";
import { formatNumber } from "@/lib/format";
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
      <CardHeader><CardTitle>رویدادهای در حال برگزاری</CardTitle>{seeAll("/messenger/calendar")}</CardHeader>
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
