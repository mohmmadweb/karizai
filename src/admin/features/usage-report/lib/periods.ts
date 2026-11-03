import type { CustomRange, PeriodId, ResolvedPeriod } from "../types";

const HOUR = 3_600_000;
export const DAY = 24 * HOUR;

export const startOfDay = (ms: number) => ms - (((ms % DAY) + DAY) % DAY);

/** `YYYY-MM-DD` to the epoch milliseconds of that UTC midnight; null when invalid. */
export function parseDay(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const ms = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isNaN(ms) ? null : ms;
}

/**
 * Turns a period choice into a time range on the mock clock. Today is hourly,
 * everything else daily. Returns null while a custom range is not valid.
 */
export function resolvePeriod(
  period: PeriodId,
  custom: CustomRange,
  nowIso: string,
): ResolvedPeriod | null {
  const today = startOfDay(new Date(nowIso).getTime());
  switch (period) {
    case "today":
      return { from: today, to: today + DAY, bucket: "hour" };
    case "week":
      return { from: today - 6 * DAY, to: today + DAY, bucket: "day" };
    case "month":
      return { from: today - 29 * DAY, to: today + DAY, bucket: "day" };
    case "custom": {
      const from = parseDay(custom.from);
      const to = parseDay(custom.to);
      if (from === null || to === null || from > to) return null;
      return { from, to: to + DAY, bucket: "day" };
    }
  }
}

/** Start instants of every bucket in the range, oldest first. */
export function bucketStarts(range: ResolvedPeriod): number[] {
  const step = range.bucket === "hour" ? HOUR : DAY;
  const starts: number[] = [];
  for (let t = range.from; t < range.to; t += step) starts.push(t);
  return starts;
}
