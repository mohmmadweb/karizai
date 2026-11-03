import { formatNumber } from "@/admin/lib/format";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const minPasswordLength = 8;

export function validateUserName(value: string) {
  return value.trim() ? undefined : "نام کاربر را وارد کنید.";
}

export function validateEmail(value: string) {
  if (!value.trim()) return "ایمیل را وارد کنید.";
  if (!emailPattern.test(value.trim()))
    return "ایمیل باید به شکل name@example.com نوشته شود.";
  return undefined;
}

export function validatePassword(value: string) {
  if (!value) return "رمز عبور را وارد کنید.";
  if (value.length < minPasswordLength)
    return `رمز عبور باید دست‌کم ${formatNumber(minPasswordLength)} نویسه باشد.`;
  return undefined;
}

export function validateGroupName(value: string) {
  return value.trim() ? undefined : "نام گروه را وارد کنید.";
}

const groupCodePattern = /^[a-z][a-z0-9-]*$/;

export function validateGroupCode(value: string) {
  const code = value.trim();
  if (!code) return "کد گروه را وارد کنید.";
  if (!groupCodePattern.test(code))
    return "کد گروه فقط می‌تواند حروف انگلیسی کوچک، عدد و خط تیره داشته باشد و باید با حرف شروع شود.";
  return undefined;
}
