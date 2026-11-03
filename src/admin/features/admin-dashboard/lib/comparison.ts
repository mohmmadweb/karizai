import type { Measure } from "../types";

export type MetricKey = keyof Measure;

export const metricLabels: Record<MetricKey, string> = {
  cost: "هزینه",
  tokens: "توکن",
  accuracy: "دقت",
  seconds: "زمان پاسخ",
};

export const metricKeys = Object.keys(metricLabels) as MetricKey[];

/** Higher is better only for accuracy. */
const higherIsBetter: Record<MetricKey, boolean> = { cost: false, tokens: false, accuracy: true, seconds: false };

export type Difference = { text: string; verdict: "better" | "worse" | "equal" };

export const verdictLabels = { better: "بهتر", worse: "بدتر", equal: "برابر" } as const;

/** Share of the multi-agent value against the direct value, in words, plus whether it is better. */
export function differenceOf(key: MetricKey, direct: number, multi: number): Difference {
  if (direct === multi) return { text: "برابر", verdict: "equal" };
  const percent = Math.round((Math.abs(multi - direct) / direct) * 100);
  const text = `${new Intl.NumberFormat("fa-IR").format(percent)}٪ ${multi > direct ? "بیشتر" : "کمتر"}`;
  const better = higherIsBetter[key] ? multi > direct : multi < direct;
  return { text, verdict: better ? "better" : "worse" };
}
