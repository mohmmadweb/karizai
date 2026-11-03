import type { Channel, ChannelPost } from "../types";

const channels: Channel[] = [
  { id: "ch-mgmt", name: "اطلاع‌رسانی مدیریت", description: "اطلاعیه‌های مدیرعامل و مدیران", memberCount: 214, publisher: "مدیریت" },
  { id: "ch-alerts", name: "هشدارهای تولید", description: "هشدار شاخص‌های خط تولید و آزمایشگاه", memberCount: 48, publisher: "هشدارها و Agentها", automatic: true },
  { id: "ch-projects", name: "اطلاع‌رسانی پروژه‌ها", description: "گزارش وضعیت پروژه‌های سازمان", memberCount: 80, publisher: "مدیران پروژه" },
];

const posts: ChannelPost[] = [
  { id: "cp-1", channelId: "ch-mgmt", author: "حمید نوروزی", createdAt: "2026-11-01T06:00:00.000Z", text: "جلسه‌ی ماهانه‌ی مدیران پنجشنبه ۱۴ آبان ساعت ۱۴ برگزار می‌شود؛ گزارش واحدها را تا چهارشنبه بفرستید." },
  { id: "cp-2", channelId: "ch-alerts", author: "تحلیل‌گر شاخص‌های تولید", createdAt: "2026-11-02T03:40:00.000Z", text: "دمای ناحیه‌ی ۴ اکسترودر خط ۲ به ۲۴۸ درجه رسید (حد ۲۴۰). ضایعات ۴٫۸٪. علت احتمالی: حسگر یا تنظیم گرمکن.", automatic: { href: "/alerts", label: "قاعده‌ی هشدار «دمای ناحیه‌ی ۴ اکسترودر»" } },
  { id: "cp-3", channelId: "ch-alerts", author: "دستیار کیفیت و فرمولاسیون", createdAt: "2026-11-02T05:15:00.000Z", text: "بچ B-1405-2217 در آزمون رنگ مردود شد (ΔE ۲٫۹، حد ۱٫۵). تحلیل علت در «میز کار من» آماده است.", automatic: { href: "/agents", label: "Agent «دستیار کیفیت و فرمولاسیون»" } },
  { id: "cp-4", channelId: "ch-projects", author: "رضا محمدی", createdAt: "2026-10-30T09:00:00.000Z", text: "پروژه‌ی «بهینه‌سازی خط ۲»: حسگر دمای دوم روی قالب نصب شد." },
];

/** A ready announcement the assistant drafts for each channel. */
export const announcementDrafts: Record<string, string> = {
  "ch-mgmt": "همکاران گرامی، با اجرای طرح بهبود دمای اکسترودر، ضایعات خط ۲ در مهرماه ۳۰٪ کم شد. از همراهی واحدهای تولید، کیفیت و نگهداری سپاسگزاریم.",
  "ch-alerts": "توجه: تا پایان کالیبراسیون حسگر دمای ناحیه‌ی ۴، نمونه‌برداری رنگ از هر بچ خط ۲ دو برابر می‌شود. مسئول: واحد کیفیت.",
  "ch-projects": "گزارش هفتگی پروژه‌ها: «بهبود کیفیت ۱۴۰۵» در مسیر است؛ «کاهش ریسک تأمین مواد اولیه» به‌دلیل تأخیر تأمین مستربچ ریسک تأخیر بالا دارد.",
};

export function getChannels(): Channel[] {
  return channels;
}

export function getChannelPosts(): ChannelPost[] {
  return posts;
}
