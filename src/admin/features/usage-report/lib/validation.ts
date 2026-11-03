import type { CustomRange } from "../types";
import { parseDay } from "./periods";

export type RangeErrors = { from?: string; to?: string; range?: string };

/** Errors for a custom range, or an empty object when it is valid. */
export function validateRange(range: CustomRange): RangeErrors {
  if (!range.from || !range.to) {
    return {
      from: range.from ? undefined : "هر دو تاریخ را وارد کنید.",
      to: range.to ? undefined : "هر دو تاریخ را وارد کنید.",
    };
  }
  const from = parseDay(range.from);
  const to = parseDay(range.to);
  if (from === null || to === null) return { range: "تاریخ واردشده درست نیست." };
  if (from > to) return { range: "تاریخ شروع باید پیش از تاریخ پایان باشد." };
  return {};
}

export const hasRangeErrors = (errors: RangeErrors) => Object.values(errors).some(Boolean);
