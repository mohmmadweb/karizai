const locale = "fa-IR";

type DateInput = string | number | Date;

/** Persian digits and separators, for example ۱۲٬۵۰۰. */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, options).format(value);
}

/** Amount with a unit label. The unit is passed in; no currency is assumed. */
export function formatPrice(value: number, unit: string) {
  return `${formatNumber(value)} ${unit}`;
}

export function formatPercent(fraction: number) {
  return formatNumber(fraction, { style: "percent", maximumFractionDigits: 1 });
}

/** Persian (Solar Hijri) calendar in Tehran time, so the built page and the browser agree. Accepts ISO strings. */
export function formatDate(
  value: DateInput,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
) {
  return new Intl.DateTimeFormat(locale, { timeZone: "Asia/Tehran", ...options }).format(new Date(value));
}

export function formatDateTime(value: DateInput) {
  return formatDate(value, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
}

/** File size with Persian digits, such as «۲٫۴ مگابایت». */
export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${formatNumber(bytes)} بایت`;
  if (bytes < 1024 * 1024) return `${formatNumber(bytes / 1024, { maximumFractionDigits: 0 })} کیلوبایت`;
  return `${formatNumber(bytes / (1024 * 1024), { maximumFractionDigits: 1 })} مگابایت`;
}
