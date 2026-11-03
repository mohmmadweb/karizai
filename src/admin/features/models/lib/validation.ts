const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

/** Turns Persian or Arabic digits and separators into a plain number string. */
export function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(arabicDigits.indexOf(d)))
    .replace(/[٬،,\s]/g, "")
    .replace(/٫/g, ".")
    .trim();
}

export function validateProviderName(value: string) {
  return value.trim() ? undefined : "نام ارائه‌دهنده را وارد کنید.";
}

export function validateBaseUrl(value: string) {
  const url = value.trim();
  if (!url) return "نشانی پایه را وارد کنید.";
  if (!/^https?:\/\/\S+$/i.test(url)) return "نشانی باید با http:// یا https:// شروع شود.";
  try {
    new URL(url);
  } catch {
    return "نشانی پایه درست نیست.";
  }
  return undefined;
}

export function validateApiKey(value: string) {
  return value.trim() ? undefined : "کلید دسترسی را وارد کنید.";
}

export function validateDisplayName(value: string) {
  return value.trim() ? undefined : "نام نمایشی را وارد کنید.";
}

const numberMessage = "یک عدد مثبت وارد کنید.";

/** Empty means «not recorded». Returns an error message or undefined. */
export function validateNumber(value: string, whole = false) {
  const text = normalizeDigits(value);
  if (!text) return undefined;
  if (!(whole ? /^\d+$/ : /^\d+(\.\d+)?$/).test(text)) return numberMessage;
  return undefined;
}

/** Empty text becomes null (not recorded). Call after `validateNumber` passes. */
export function parseNumber(value: string): number | null {
  const text = normalizeDigits(value);
  return text ? Number(text) : null;
}
