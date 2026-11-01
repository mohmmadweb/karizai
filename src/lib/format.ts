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

/** Persian (Solar Hijri) calendar. Accepts ISO strings. */
export function formatDate(
  value: DateInput,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
) {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

export function formatDateTime(value: DateInput) {
  return formatDate(value, { dateStyle: "medium", timeStyle: "short" });
}
