/**
 * Solar Hijri (Jalali) calendar helpers built on Intl, in Tehran time, so the server render and
 * the browser agree. Days are handled as noon UTC, which is the same date in Tehran.
 */
const zone = "Asia/Tehran";
const parts = new Intl.DateTimeFormat("en-u-ca-persian-nu-latn", { timeZone: zone, year: "numeric", month: "numeric", day: "numeric" });
const dayLabel = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { timeZone: zone, day: "numeric", month: "long" });
const timeLabel = new Intl.DateTimeFormat("fa-IR", { timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: false });
const fullLabel = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { timeZone: zone, weekday: "long", day: "numeric", month: "long", year: "numeric" });

const dayMs = 864e5;

export type CalendarDay = { date: Date; key: string; day: number; /** 0 for Saturday. */ weekday: number };

function ymd(date: Date) {
  const list = parts.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(list.find((part) => part.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** Iran has kept UTC+03:30 all year since 2022. */
const tehranOffsetMs = 3.5 * 3600e3;

function noon(date: Date): Date {
  const local = new Date(date.getTime() + tehranOffsetMs);
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 12));
}

/** Key of the Jalali day an instant falls on in Tehran, for example «1405-8-11». */
export function dayKey(value: string | Date): string {
  const { year, month, day } = ymd(new Date(value));
  return `${year}-${month}-${day}`;
}

/** All days of the Jalali month that contains `anchor`. */
export function monthDays(anchor: Date): CalendarDay[] {
  let cursor = noon(anchor);
  while (ymd(cursor).day > 1) cursor = new Date(cursor.getTime() - dayMs);
  const { month } = ymd(cursor);
  const days: CalendarDay[] = [];
  while (ymd(cursor).month === month) {
    days.push({ date: cursor, key: dayKey(cursor), day: ymd(cursor).day, weekday: (cursor.getUTCDay() + 1) % 7 });
    cursor = new Date(cursor.getTime() + dayMs);
  }
  return days;
}

export const formatDay = (date: Date | string) => dayLabel.format(new Date(date));
export const formatTime = (date: Date | string) => timeLabel.format(new Date(date));
export const formatFullDate = (date: Date | string) => fullLabel.format(new Date(date));

/** An instant on a day at a Tehran time «HH:MM». */
export function atTehranTime(day: Date, time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const base = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hours, minutes);
  return new Date(base - tehranOffsetMs).toISOString();
}
