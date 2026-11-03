import { tomanPer1kTokens } from "@/lib/pricing";
import { budgetMonth } from "../data/user-limits";
import type { UserLimit } from "../data/user-limits";

/** Spent so far in toman, from the tokens and the shared toman rates. */
export const spentOf = (u: Pick<UserLimit, "internalTokens" | "externalTokens">) =>
  Math.round((u.internalTokens / 1000) * tomanPer1kTokens.internal + (u.externalTokens / 1000) * tomanPer1kTokens.external);

/** Straight-line forecast of the month end and the day the limit runs out (null when it lasts). */
export function forecast(spent: number, limit: number, month = budgetMonth) {
  const perDay = spent / month.daysPassed;
  const monthEnd = Math.round(perDay * month.daysInMonth);
  const exhaustDay = perDay > 0 && monthEnd > limit ? Math.min(month.daysInMonth, Math.max(1, Math.ceil(limit / perDay))) : null;
  return { monthEnd, exhaustDay };
}

export const toman = (value: number) => `${Math.round(value).toLocaleString("fa-IR")} تومان`;

/** Accepts Persian or Latin digits and separators. */
export function parseAmount(text: string): number | null {
  const latin = text.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٬,\s]/g, "");
  if (!/^\d+$/.test(latin)) return null;
  return Number(latin);
}
