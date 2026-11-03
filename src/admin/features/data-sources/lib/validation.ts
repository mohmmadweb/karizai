const required = (value: string, message: string) => (value.trim() ? undefined : message);

export const validateSourceName = (v: string) => required(v, "نام اتصال را وارد کنید.");
export const validateHost = (v: string) => required(v, "نشانی سرور را وارد کنید.");
export const validateDatabaseName = (v: string) => required(v, "نام پایگاه را وارد کنید.");
export const validateUsername = (v: string) => required(v, "نام کاربری را وارد کنید.");
export const validatePassword = (v: string) => required(v, "رمز عبور را وارد کنید.");

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

/** Turns Persian digits into Latin ones so «۵۴۳۲» is accepted. */
export function normalizePort(value: string) {
  return value.replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d))).trim();
}

export function validatePort(value: string) {
  const text = normalizePort(value);
  if (!text) return "درگاه را وارد کنید.";
  const n = Number(text);
  if (!/^\d+$/.test(text) || n < 1 || n > 65535) return "درگاه باید عددی بین ۱ تا ۶۵۵۳۵ باشد.";
  return undefined;
}
