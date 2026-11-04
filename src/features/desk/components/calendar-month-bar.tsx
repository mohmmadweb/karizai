"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { FilterPill } from "@/components/shared/moto/moto";
import { formatDate } from "@/lib/format";
import { jalaliParts, monthWeeks } from "../lib/jalali";

const monthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const rangeFormat = (locale: string, first: Date, last: Date) => {
  const a = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(first);
  const b = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(last);
  return a === b ? a : `${a} - ${b}`;
};

type Props = { anchor: Date; today: Date; onPrevious: () => void; onNext: () => void; onGo: (year: number, month: number) => void; onToday: () => void };

/** White card under the hero: previous and next month, month and year dropdowns, the other calendars and «امروز». */
export function CalendarMonthBar({ anchor, today, onPrevious, onNext, onGo, onToday }: Props) {
  const { year, month } = jalaliParts(anchor);
  const days = monthWeeks(anchor).flat().filter((cell) => cell !== null);
  const first = days[0]!.date;
  const last = days[days.length - 1]!.date;
  const years = Array.from({ length: 9 }, (_, index) => year - 4 + index);
  return (
    <section aria-label="ماه" className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border bg-card p-4">
      <button type="button" onClick={onPrevious} className="flex h-10 items-center gap-2 rounded-lg px-3 text-body-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"><ArrowRightIcon className="size-4" aria-hidden />ماه قبل</button>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <FilterPill label="ماه" value={String(month)} options={monthNames.map((name, index) => ({ value: String(index + 1), label: name }))} onChange={(value) => onGo(year, Number(value))} />
          <FilterPill label="سال" value={String(year)} options={years.map((y) => ({ value: String(y), label: y.toLocaleString("fa-IR", { useGrouping: false }) }))} onChange={(value) => onGo(Number(value), month)} />
        </div>
        <p dir="ltr" className="text-body-sm">{rangeFormat("en-US-u-ca-gregory", first, last)}</p>
        <p className="text-caption text-muted-foreground">{rangeFormat("fa-IR-u-ca-islamic", first, last)}</p>
        <button type="button" onClick={onToday} className="rounded-full bg-accent px-3 py-1 text-caption text-accent-foreground outline-none hover:bg-accent/70 focus-visible:ring-3 focus-visible:ring-ring/50">امروز: {formatDate(today, { weekday: "long", day: "numeric", month: "long" })}</button>
      </div>
      <button type="button" onClick={onNext} className="flex h-10 items-center gap-2 rounded-lg px-3 text-body-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">ماه بعد<ArrowLeftIcon className="size-4" aria-hidden /></button>
    </section>
  );
}
