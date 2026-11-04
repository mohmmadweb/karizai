import type { PageContext, QuickKey } from "../types";

/** Page names by route; the longest matching prefix wins. */
const pages: { prefix: string; key: QuickKey; title: string }[] = [
  { prefix: "/desk", key: "dash", title: "میز کار من" },
  { prefix: "/calendar", key: "default", title: "تقویم کاری" },
  { prefix: "/messenger/groups", key: "groups", title: "گروه‌ها" },
  { prefix: "/messenger/channels", key: "default", title: "کانال‌ها" },
  { prefix: "/messenger/news", key: "default", title: "اخبار سازمان" },
  { prefix: "/messenger/members", key: "default", title: "اعضای سازمان" },
  { prefix: "/messenger/projects", key: "projects", title: "پروژه‌های من" },
  { prefix: "/messenger/tasks", key: "default", title: "وظایف من" },
  { prefix: "/messenger", key: "conversations", title: "گفتگوها" },
  { prefix: "/chat", key: "default", title: "دستیار هوشمند" },
  { prefix: "/agents", key: "default", title: "عامل‌های من" },
  { prefix: "/agent-repository", key: "default", title: "مخزن عامل‌ها" },
  { prefix: "/skills", key: "default", title: "اسکیل‌های من" },
  { prefix: "/compare", key: "default", title: "مقایسه‌ی مدل‌ها" },
  { prefix: "/workflows", key: "default", title: "جریان‌های خودکار" },
  { prefix: "/alerts", key: "default", title: "هشدارها و گزارش‌ها" },
  { prefix: "/connections", key: "default", title: "اتصال‌ها" },
  { prefix: "/knowledge", key: "files", title: "دانش سازمانی" },
  { prefix: "/data", key: "default", title: "داده و تحلیل" },
  { prefix: "/usage", key: "default", title: "مصرف من" },
  { prefix: "/developer", key: "default", title: "توسعه‌دهندگان و API" },
  { prefix: "/friends", key: "page/friends", title: "ارتباطات من" },
  { prefix: "/blogs", key: "page/blogs", title: "وبلاگ‌ها" },
  { prefix: "/magazines", key: "page/magazines", title: "مجلات" },
  { prefix: "/media", key: "page/media", title: "رسانه" },
  { prefix: "/forums", key: "page/forums", title: "پرسش و پاسخ" },
  { prefix: "/faqs", key: "page/faqs", title: "سوالات متداول" },
  { prefix: "/hashtags", key: "page/hashtags", title: "هشتگ‌ها" },
  { prefix: "/categories", key: "page/categories", title: "دسته‌بندی‌ها" },
  { prefix: "/events", key: "page/events", title: "رویدادها و جلسات" },
  { prefix: "/activity-report", key: "page/activity-report", title: "گزارش فعالیت‌های من" },
  { prefix: "/project-settings", key: "page/project-settings", title: "تنظیمات پروژه" },
  { prefix: "/access", key: "page/access", title: "نقش و دسترسی من" },
  { prefix: "/support", key: "page/support", title: "تیکت پشتیبانی" },
  { prefix: "/settings", key: "default", title: "تنظیمات" },
];

/** Quick questions of each page, from the target design. */
/** Content pages use their own keys («page/route»), outside the closed QuickKey list, so each has its two questions. */
const quickQuestions: Record<string, string[]> = {
  dash: ["خلاصه امروز من", "چه کارهایی معوق دارم؟", "دستور جلسه ساعت ۱۰:۳۰"],
  groups: ["خلاصه پیام‌های خوانده‌نشده", "تصمیم‌های باز گروه", "پیش‌نویس پیام برای گروه"],
  conversations: ["خلاصه این گفتگو", "پاسخ پیشنهادی", "تبدیل به وظیفه"],
  files: ["خلاصه این پوشه", "کدام سند درباره رطوبت است؟", "مقایسه دو نسخه"],
  projects: ["گزارش وضعیت هفتگی", "ریسک تأخیر", "ساخت وظایف از صورت‌جلسه"],
  "page/friends": ["درخواست‌های ارتباطی امروز چیست؟", "چه کسانی را به ارتباطاتم اضافه کنم؟"],
  "page/blogs": ["خلاصه‌ی تازه‌ترین وبلاگ", "کدام وبلاگ درباره‌ی QC-SOP-07 است؟"],
  "page/magazines": ["خلاصه‌ی آخرین شماره", "کدام شماره درباره‌ی خط ۲ است؟"],
  "page/media": ["جدیدترین ویدیوهای آموزشی کدام‌اند؟", "اسناد مربوط به HD5502 را پیدا کن"],
  "page/forums": ["پرسش‌های بدون پاسخ کدام‌اند؟", "پاسخ پیشنهادی برای پرسش خط ۲"],
  "page/faqs": ["حد مجاز رطوبت گرانول چقدر است؟", "نمونه‌برداری طبق QC-SOP-07 چگونه است؟"],
  "page/hashtags": ["کدام هشتگ‌ها در حال رشد هستند؟", "پرکاربردترین هشتگ این هفته چیست؟"],
  "page/categories": ["کدام دسته‌بندی بیشترین آیتم را دارد؟", "پیشنهاد دسته‌بندی برای اسناد کیفیت"],
  "page/events": ["دستور جلسه‌ی امروز", "کدام جلسه‌ها پیش رو هستند؟"],
  "page/activity-report": ["گزارش هفته‌ی من", "چه وظایف معوقی دارم؟"],
  "page/project-settings": ["چه کسانی مدیر پروژه‌اند؟", "عضو مناسب برای پروژه‌ی خط ۲ چه کسی است؟"],
  "page/access": ["به کدام مدل‌ها دسترسی دارم؟", "کدام اتصال‌ها فقط خواندنی هستند؟"],
  "page/support": ["پاسخ پیشنهادی برای تیکت باز", "چطور دسترسی بیشتر بگیرم؟"],
  default: ["خلاصه این صفحه", "چه کمکی می‌توانی بکنی؟"],
};

export function getPageContext(pathname: string): PageContext {
  const match = [...pages]
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((page) => pathname === page.prefix || pathname.startsWith(`${page.prefix}/`));
  return match ? { key: match.key, title: match.title } : { key: "default", title: "این صفحه" };
}

export function getQuickQuestions(key: QuickKey | string): string[] {
  return quickQuestions[key] ?? quickQuestions.default;
}
