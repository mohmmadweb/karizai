/** Solar Hijri (Persian) calendar helpers built on Intl, with Saturday as the first day of the week. */
const parts = new Intl.DateTimeFormat("en-u-ca-persian-nu-latn", { year: "numeric", month: "numeric", day: "numeric" });

export function jalaliParts(date: Date): { year: number; month: number; day: number } {
  const found = Object.fromEntries(parts.formatToParts(date).map((part) => [part.type, part.value]));
  return { year: Number(found.year), month: Number(found.month), day: Number(found.day) };
}

/** A key for the calendar day of a date, in local time. */
export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export type MonthCell = { date: Date; day: number } | null;

/** The weeks of the Persian month that contains `anchor`; empty cells pad the first and last week. */
export function monthWeeks(anchor: Date): MonthCell[][] {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), 12);
  while (jalaliParts(first).day !== 1) first.setDate(first.getDate() - 1);
  const month = jalaliParts(first).month;
  const cells: MonthCell[] = Array.from({ length: (first.getDay() + 1) % 7 }, () => null);
  for (const date = new Date(first); jalaliParts(date).month === month; date.setDate(date.getDate() + 1)) {
    cells.push({ date: new Date(date), day: jalaliParts(date).day });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
}
