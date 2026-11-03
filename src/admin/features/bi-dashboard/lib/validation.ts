import type { IndicatorErrors, IndicatorInput, SourceKind } from "../types";

export const sourceLabels: Record<SourceKind, string> = {
  mes: "MES (سامانه‌ی اجرای تولید)",
  iot: "حسگر IoT (MQTT)",
  sql: "پایگاه داده (SQL Server)",
  manual: "ورود دستی",
};

export const referenceHints: Record<SourceKind, { label: string; placeholder: string; hint: string } | null> = {
  mes: { label: "نام شاخص در MES", placeholder: "scrap_rate_line2", hint: "همان نامی که MES برای این شاخص دارد." },
  iot: { label: "موضوع حسگر (topic)", placeholder: "plant/line2/zone4/temp", hint: "نشانی حسگر روی بروکر؛ حروف لاتین، عدد، خط تیره و / و بدون فاصله." },
  sql: { label: "کوئری فقط‌خواندنی", placeholder: "SELECT TOP 1 Value FROM Table ORDER BY At DESC", hint: "فقط یک SELECT که یک عدد برمی‌گرداند." },
  manual: null,
};

const writeWords = /\b(insert|update|delete|drop|alter|truncate|exec|execute|merge|create|grant)\b/i;

export function validateReference(source: SourceKind, reference: string): string | undefined {
  const text = reference.trim();
  if (source === "manual") return undefined;
  if (!text) return "این فیلد را پر کنید.";
  if (source === "iot" && !/^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*$/.test(text)) return "موضوع فقط حروف لاتین، عدد، _ و - دارد، با / جدا می‌شود و فاصله ندارد؛ مثلاً plant/line2/zone4/temp.";
  if (source === "mes" && !/^[A-Za-z0-9_.-]+$/.test(text)) return "نام شاخص در MES فقط حروف لاتین، عدد، _ ، - و نقطه دارد.";
  if (source === "sql") {
    if (!/^select\b/i.test(text)) return "فقط کوئری فقط‌خواندنی مجاز است؛ متن باید با SELECT شروع شود.";
    if (text.includes(";") || writeWords.test(text)) return "کوئری فقط یک SELECT است و دستور نوشتن یا «;» ندارد.";
  }
  return undefined;
}

export function validateIndicator(input: IndicatorInput, others: { name: string }[]): IndicatorErrors {
  const errors: IndicatorErrors = {};
  const name = input.name.trim();
  if (!name) errors.name = "نام شاخص را وارد کنید.";
  else if (others.some((item) => item.name.trim() === name)) errors.name = "شاخصی با این نام هست.";
  const { lowerLimit: lo, upperLimit: hi } = input;
  if (Number.isNaN(lo) || Number.isNaN(hi)) errors.limits = "حد پایین و حد بالا باید عدد باشند.";
  else if (lo === null && hi === null) errors.limits = "دست‌کم یکی از حد پایین و حد بالا را بنویسید.";
  else if (lo !== null && hi !== null && lo >= hi) errors.limits = "حد پایین باید کمتر از حد بالا باشد.";
  const reference = validateReference(input.source, input.reference);
  if (reference) errors.reference = reference;
  if (!Number.isInteger(input.refreshMinutes) || input.refreshMinutes < 1 || input.refreshMinutes > 1440) errors.refreshMinutes = "عددی بین ۱ تا ۱۴۴۰ دقیقه بنویسید.";
  if (input.userIds.length + input.groupIds.length === 0) errors.responsible = "دست‌کم یک کاربر یا گروه مسئول انتخاب کنید.";
  return errors;
}
