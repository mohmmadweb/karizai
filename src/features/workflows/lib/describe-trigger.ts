import type { EventKind, Trigger, Weekday } from "../types";

export const weekdayLabels: Record<Weekday, string> = {
  sat: "شنبه", sun: "یکشنبه", mon: "دوشنبه", tue: "سه‌شنبه", wed: "چهارشنبه", thu: "پنجشنبه", fri: "جمعه",
};

export const eventLabels: Record<EventKind, string> = {
  "new-customer": "ثبت مشتری جدید در CRM",
  "new-email": "رسیدن ایمیل تازه",
  "indicator-breach": "خروج یک شاخص از حد مجاز",
  webhook: "فراخوانی نشانی اختصاصی (webhook)",
};

const digits = (text: string) => text.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export function describeTrigger(trigger: Trigger): string {
  if (trigger.kind === "manual") return "دستی (با دکمه‌ی اجرا)";
  if (trigger.kind === "event") return `رویداد: ${eventLabels[trigger.event]}`;
  if (trigger.every === "hourly") return "زمان‌بندی: هر ساعت";
  if (trigger.every === "daily") return `زمان‌بندی: هر روز ${digits(trigger.time)}`;
  return `زمان‌بندی: هر ${weekdayLabels[trigger.weekday ?? "sat"]} ${digits(trigger.time)}`;
}

/** Schedule and event triggers run without the user, so the admin must approve them first. */
export const needsApproval = (triggers: Trigger[]) => triggers.some((t) => t.kind !== "manual");
