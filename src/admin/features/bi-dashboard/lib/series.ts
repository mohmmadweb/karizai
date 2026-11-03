import { getSeededCurrents } from "../data/indicators";
import type { Indicator, IndicatorStatus, Reading } from "../types";

/** Same text, same number between 0 and 1, so figures never jump between renders. */
function unit(seed: string, index: number): number {
  let h = 2166136261;
  for (const ch of `${seed}:${index}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}

const round = (value: number) => Math.round(value * 100) / 100;

/** The middle of the range, and half of its width (open sides borrow the other side). */
function span(indicator: Indicator) {
  const { lowerLimit: lo, upperLimit: hi } = indicator;
  if (lo !== null && hi !== null) return { mid: (lo + hi) / 2, half: (hi - lo) / 2 };
  const edge = (lo ?? hi) as number;
  return { mid: edge * (lo !== null ? 1.25 : 0.7), half: Math.max(Math.abs(edge) * 0.25, 0.5) };
}

/** 24 hourly values ending at the current one. Indicators without a seeded value stay inside their range. */
export function readingFor(indicator: Indicator): Reading {
  const { mid, half } = span(indicator);
  const seeded = getSeededCurrents()[indicator.id];
  const current = seeded ?? round(mid + (unit(indicator.id, 99) - 0.5) * half * 1.2);
  const series = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    const calm = mid + (unit(indicator.id, i) - 0.5) * half * 0.5;
    return round(i === 23 ? current : calm + (current - calm) * t ** 3);
  });
  return { current, series };
}

export function statusOf(indicator: Indicator, value: number): IndicatorStatus {
  const { lowerLimit: lo, upperLimit: hi } = indicator;
  if ((lo !== null && value < lo) || (hi !== null && value > hi)) return "out";
  const width = lo !== null && hi !== null ? hi - lo : Math.abs((lo ?? hi) as number) * 0.5;
  const margin = width * 0.1;
  if ((lo !== null && value - lo <= margin) || (hi !== null && hi - value <= margin)) return "near";
  return "ok";
}

export const statusLabels: Record<IndicatorStatus, string> = { ok: "در حد مجاز", near: "نزدیک به حد", out: "خارج از حد" };

/** For example «بالاتر از ۲۴۰ °C», or `null` when the value is inside the range. */
export function breachText(indicator: Indicator, value: number): string | null {
  const { lowerLimit: lo, upperLimit: hi } = indicator;
  if (hi !== null && value > hi) return `بالاتر از ${hi.toLocaleString("fa-IR")}`;
  if (lo !== null && value < lo) return `پایین‌تر از ${lo.toLocaleString("fa-IR")}`;
  return null;
}

export function limitsText(indicator: Indicator): string {
  const { lowerLimit: lo, upperLimit: hi, unit: u } = indicator;
  const f = (n: number) => n.toLocaleString("fa-IR");
  const range = lo !== null && hi !== null ? `${f(lo)} تا ${f(hi)}` : hi !== null ? `حداکثر ${f(hi)}` : `حداقل ${f(lo as number)}`;
  return `${range}${u ? ` ${u}` : ""}`;
}
