/** «1.3» → «۱٫۳». */
export const ver = (v: string) => v.replace(".", "٫").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const pct = (n: number) => `${Math.round(n * 100).toLocaleString("fa-IR")}٪`;

/** Signed change in percentage points, or «بدون تغییر». */
export function change(now: number, before: number) {
  const diff = Math.round((now - before) * 100);
  if (diff === 0) return "بدون تغییر";
  return `${diff > 0 ? "+" : "−"}${Math.abs(diff).toLocaleString("fa-IR")}٪`;
}
