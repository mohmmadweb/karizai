import type { Thresholds } from "../types";

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const message = "یک عدد مثبت وارد کنید.";

/** Positive number from text typed with Persian or Latin digits, or undefined. */
export function parsePositive(value: string): number | undefined {
  const text = value
    .replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)))
    .replace(/٫/g, ".")
    .trim();
  if (!/^\d+(\.\d+)?$/.test(text)) return undefined;
  const n = Number(text);
  return n > 0 ? n : undefined;
}

export type ThresholdText = Record<keyof Thresholds, string>;
export type ThresholdErrors = Partial<Record<keyof Thresholds, string>>;

export function validateThresholds(text: ThresholdText): ThresholdErrors {
  const errors: ThresholdErrors = {};
  (Object.keys(text) as (keyof Thresholds)[]).forEach((key) => {
    if (parsePositive(text[key]) === undefined) errors[key] = message;
  });
  return errors;
}

export function toThresholds(text: ThresholdText): Thresholds {
  return {
    ttftP95Sec: parsePositive(text.ttftP95Sec)!,
    e2eP95Sec: parsePositive(text.e2eP95Sec)!,
    errorRatePercent: parsePositive(text.errorRatePercent)!,
  };
}
