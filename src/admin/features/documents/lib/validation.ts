import { formatBytes } from "@/admin/lib/format";
import { getUploadLimits } from "../data/limits";
import type { PickedFile } from "../types";

export const extensionOf = (fileName: string) =>
  (fileName.includes(".") ? fileName.split(".").pop() ?? "" : "").toLowerCase();

/** Error text for a file that cannot be uploaded, or undefined when it can. */
export function checkFile(file: PickedFile): string | undefined {
  const { maxBytes, extensions } = getUploadLimits();
  if (!extensions.includes(extensionOf(file.name))) return "این فرمت پشتیبانی نمی‌شود.";
  if (file.sizeBytes > maxBytes) {
    return `حجم فایل از ${formatBytes(maxBytes)} بیشتر است.`;
  }
  return undefined;
}

const required = (value: string, message: string) => (value.trim() ? undefined : message);

export const validateDocName = (v: string) => required(v, "نام سند را وارد کنید.");
export const validateSourceName = (v: string) => required(v, "نام منبع را وارد کنید.");
export const validateHost = (v: string) => required(v, "نشانی سرور را وارد کنید.");
export const validateFolderPath = (v: string) => required(v, "مسیر پوشه را وارد کنید.");
export const validateUsername = (v: string) => required(v, "نام کاربری را وارد کنید.");
export const validatePassword = (v: string) => required(v, "رمز عبور را وارد کنید.");

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
export const normalizePort = (v: string) =>
  v.replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d))).trim();

export function validatePort(value: string) {
  const text = normalizePort(value);
  if (!text) return "درگاه را وارد کنید.";
  const n = Number(text);
  if (!/^\d+$/.test(text) || n < 1 || n > 65535) return "درگاه باید عددی بین ۱ تا ۶۵۵۳۵ باشد.";
  return undefined;
}
