const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
export const budgetMessage = "یک عدد مثبت وارد کنید.";

/** Tomans from text with Persian or Latin digits and thousand separators; null when empty; undefined when invalid. */
export function parseBudget(value: string): number | null | undefined {
  const text = value
    .replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)))
    .replace(/[٬,\s]/g, "");
  if (text === "") return null;
  if (!/^\d+$/.test(text)) return undefined;
  const n = Number(text);
  return n > 0 && Number.isSafeInteger(n) ? n : undefined;
}

export const budgetText = (limit: number | null | undefined) => (limit == null ? "" : String(limit));
