/**
 * The day the sample data is built around (۱۳ آبان ۱۴۰۵, 10:00 in Tehran). Pages that talk about
 * «today» use it, so the server-rendered page and the browser agree and the sample stays coherent.
 */
export const demoToday = "2026-11-04T06:30:00.000Z";

const dayMs = 864e5;

/** Whole days from the demo day to an ISO date; negative when it is past. */
export function daysFromToday(iso: string): number {
  const start = new Date(demoToday.slice(0, 10)).getTime();
  return Math.round((new Date(iso.slice(0, 10)).getTime() - start) / dayMs);
}

/** ISO date a number of days after the demo day. */
export function addDays(days: number): string {
  return new Date(new Date(demoToday.slice(0, 10)).getTime() + days * dayMs).toISOString();
}
