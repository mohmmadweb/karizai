import type { CalendarEvent } from "@/features/social/types";

function at(daysFromToday: number, hour: number, minute = 0, hours = 1): { start: string; durationMinutes: number } {
  const start = new Date();
  start.setDate(start.getDate() + daysFromToday);
  start.setHours(hour, minute, 0, 0);
  return { start: start.toISOString(), durationMinutes: hours * 60 };
}

/**
 * Meetings and events around today; the dates are relative so the desk always has something to show.
 * This is the first content of the shared calendar store (`useCalendar`), which the desk, the calendar
 * page and the workflows all read.
 */
export function getEvents(): CalendarEvent[] {
  return [
    { id: "evt-1", title: "جلسه‌ی بازبینی کیفیت", place: "اتاق جلسات ۲", ...at(0, 10, 30, 2), agenda: true, hasMinutes: true },
    { id: "evt-2", title: "هماهنگی خرید مواد اولیه", place: "آنلاین", ...at(0, 15, 0) },
    { id: "evt-3", title: "نمایشگاه صنایع پلیمر", place: "تهران", ...at(3, 9, 0, 8) },
    { id: "evt-4", title: "جلسه‌ی تأمین", place: "اتاق جلسات ۱", ...at(-3, 11, 0), hasMinutes: true },
  ];
}
