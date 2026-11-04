export type DeskEvent = {
  id: string;
  title: string;
  /** ISO date and time. */
  startsAt: string;
  endsAt: string;
  place: string;
  /** What the assistant prepared for it, shown as a small action. */
  assistant?: { label: string };
};

function at(daysFromToday: number, hour: number, minute = 0, hours = 1): { startsAt: string; endsAt: string } {
  const start = new Date();
  start.setDate(start.getDate() + daysFromToday);
  start.setHours(hour, minute, 0, 0);
  return { startsAt: start.toISOString(), endsAt: new Date(start.getTime() + hours * 36e5).toISOString() };
}

/** Meetings and events around today; the dates are relative so the desk always has something to show. */
export function getEvents(): DeskEvent[] {
  return [
    { id: "evt-1", title: "جلسه‌ی بازبینی کیفیت", place: "اتاق جلسات ۲", ...at(0, 10, 30, 2), assistant: { label: "دستور جلسه" } },
    { id: "evt-2", title: "هماهنگی خرید مواد اولیه", place: "آنلاین", ...at(0, 15, 0) },
    { id: "evt-3", title: "نمایشگاه صنایع پلیمر", place: "تهران", ...at(3, 9, 0, 8) },
    { id: "evt-4", title: "جلسه‌ی تأمین", place: "اتاق جلسات ۱", ...at(-3, 11, 0), assistant: { label: "صورت‌جلسه آماده است" } },
  ];
}
