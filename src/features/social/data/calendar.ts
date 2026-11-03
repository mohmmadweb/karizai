import type { CalendarEvent, MeetingMinutes } from "../types";
import { minutesTasks } from "./ai-answers";

/** Times are in Tehran (UTC+03:30); for example 07:00Z is 10:30. */
const events: CalendarEvent[] = [
  { id: "ev-1", title: "جلسه‌ی تأمین مواد اولیه", start: "2026-10-28T05:30:00.000Z", durationMinutes: 60, place: "اتاق جلسات ۱", hasMinutes: true },
  { id: "ev-2", title: "جلسه‌ی بازبینی کیفیت", start: "2026-11-02T07:00:00.000Z", durationMinutes: 60, place: "اتاق جلسات ۲", hasMinutes: true },
  { id: "ev-3", title: "بازدید از خط ۲ با واحد نگهداری", start: "2026-11-03T10:30:00.000Z", durationMinutes: 45, place: "سالن تولید خط ۲" },
  { id: "ev-4", title: "نمایشگاه صنایع پلیمر", start: "2026-11-05T05:30:00.000Z", durationMinutes: 480, place: "تهران · نمایشگاه بین‌المللی" },
  { id: "ev-5", title: "جلسه‌ی هفتگی پروژه‌ی بهبود کیفیت", start: "2026-11-07T07:30:00.000Z", durationMinutes: 60, place: "برخط" },
  { id: "ev-6", title: "جلسه‌ی فروش با آریاپلاست", start: "2026-11-09T09:30:00.000Z", durationMinutes: 60, place: "اتاق جلسات ۲", suggested: true },
  { id: "ev-7", title: "آموزش رویه‌ی QC-SOP-07", start: "2026-11-16T06:30:00.000Z", durationMinutes: 90, place: "سالن آموزش" },
];

const minutes: MeetingMinutes[] = [
  {
    eventId: "ev-1",
    decisions: ["سفارش ۸۰ تن HD5502 به جریان سفارش‌دهی خودکار سپرده شد و تأیید نهایی با مسئول کیفیت است.", "نقطه‌ی سفارش POE از ۱۲ به ۱۵ تن می‌رسد."],
    tasks: [
      { title: "تنظیم نقطه‌ی سفارش POE در سامانه‌ی انبار", assigneeId: "col-sara", dueDate: "2026-11-04T00:00:00.000Z", projectId: "proj-3" },
      { title: "استعلام قیمت HD5502 از دو تأمین‌کننده‌ی داخلی", assigneeId: "col-ali", dueDate: "2026-11-06T00:00:00.000Z", projectId: "proj-3" },
    ],
  },
  {
    eventId: "ev-2",
    decisions: ["گرید جایگزین مستربچ پیش از سفارش تازه روی خط ۲ آزمون می‌شود.", "بند ۴.۲ رویه‌ی QC-SOP-07 درباره‌ی نمونه‌برداری رنگ بازنگری می‌شود.", "حسگر دمای ناحیه‌ی ۴ پیش از آزمون کالیبره می‌شود."],
    tasks: minutesTasks,
  },
];

export function getEvents(): CalendarEvent[] {
  return events;
}

export function getMinutes(eventId: string): MeetingMinutes | undefined {
  return minutes.find((item) => item.eventId === eventId);
}
