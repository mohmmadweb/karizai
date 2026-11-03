import type { MaskField } from "@/lib/policy-store";

const meta = /[\\^$.*+?()[\]{}]/;

/** «فهرست» when the pattern is just words joined by «|», otherwise «الگو». */
export const detectionOf = (field: MaskField) => (meta.test(field.pattern) ? "الگو" : "فهرست");

/** Valid regular expression or null. */
export function compilePattern(pattern: string): RegExp | null {
  if (!pattern.trim()) return null;
  try {
    return new RegExp(pattern, "g");
  } catch {
    return null;
  }
}

/** Words of a list rule turned into a pattern. */
export const listToPattern = (words: string[]) =>
  words.map((w) => w.trim().replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")).filter(Boolean).join("|");

/** Text prefilled in the test box; it holds one value of each sample field. */
export const sampleTestText =
  "لطفاً پیش‌فاکتور آریاپلاست را با قیمت فروش امروز آماده کن. کد ملی نماینده 0012345678، همراه 09121234567، " +
  "شبا IR820540102680020817909002. فرمول کامپاند PP-H30 را هم پیوست کن.";
