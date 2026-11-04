"use client";

import { useEffect, useState } from "react";

const zone = "Asia/Tehran";
const clockFormat = new Intl.DateTimeFormat("fa-IR", { timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const solarLong = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { timeZone: zone, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const solarNumeric = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" });
const gregoryNumeric = new Intl.DateTimeFormat("fa-IR-u-ca-gregory", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" });
const gregoryLong = new Intl.DateTimeFormat("en-US-u-ca-gregory", { timeZone: zone, weekday: "long", year: "numeric", month: "long", day: "numeric" });
const lunarNumeric = new Intl.DateTimeFormat("fa-IR-u-ca-islamic", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" });
const lunarLong = new Intl.DateTimeFormat("fa-IR-u-ca-islamic", { timeZone: zone, weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** The navy hero of the calendar: the live Tehran clock and today's Solar, Gregorian and Lunar dates. */
export function CalendarHero() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const dates = [
    { label: "تاریخ خورشیدی", main: solarNumeric.format(now), sub: solarLong.format(now), ltr: false },
    { label: "تاریخ میلادی", main: gregoryNumeric.format(now), sub: gregoryLong.format(now), ltr: true },
    { label: "تاریخ قمری", main: lunarNumeric.format(now), sub: lunarLong.format(now), ltr: false },
  ];
  return (
    <section aria-label="ساعت و تقویم" className="grid overflow-hidden rounded-2xl bg-linear-to-br from-sidebar to-primary text-primary-foreground shadow-sm md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="flex flex-col items-center justify-center gap-2 p-6 md:border-e md:border-white/15">
        <p className="text-body-sm opacity-80">ساعت تهران</p>
        <p dir="ltr" role="timer" aria-live="off" className="text-4xl font-bold tabular-nums sm:text-5xl">{clockFormat.format(now)}</p>
      </div>
      <div className="flex min-w-0 flex-col gap-4 p-6">
        <h2 className="text-h4">ساعت و تقویم <span className="mx-1 opacity-50">|</span> <span className="font-normal">{solarLong.format(now)}</span></h2>
        <dl className="grid gap-4 border-t border-white/15 pt-4 sm:grid-cols-3">
          {dates.map((item) => (
            <div key={item.label} className="flex min-w-0 flex-col gap-1 text-center">
              <dt className="text-label">{item.label}</dt>
              <dd className="text-body font-medium tabular-nums">{item.main}</dd>
              <dd className="truncate text-caption opacity-75" dir={item.ltr ? "ltr" : undefined}>{item.sub}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
