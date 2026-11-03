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
  { prefix: "/settings", key: "default", title: "تنظیمات" },
];

/** Quick questions of each page, from the target design. */
const quickQuestions: Record<QuickKey, string[]> = {
  dash: ["خلاصه امروز من", "چه کارهایی معوق دارم؟", "دستور جلسه ساعت ۱۰:۳۰"],
  groups: ["خلاصه پیام‌های خوانده‌نشده", "تصمیم‌های باز گروه", "پیش‌نویس پیام برای گروه"],
  conversations: ["خلاصه این گفتگو", "پاسخ پیشنهادی", "تبدیل به وظیفه"],
  files: ["خلاصه این پوشه", "کدام سند درباره رطوبت است؟", "مقایسه دو نسخه"],
  projects: ["گزارش وضعیت هفتگی", "ریسک تأخیر", "ساخت وظایف از صورت‌جلسه"],
  default: ["خلاصه این صفحه", "چه کمکی می‌توانی بکنی؟"],
};

export function getPageContext(pathname: string): PageContext {
  const match = [...pages]
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((page) => pathname === page.prefix || pathname.startsWith(`${page.prefix}/`));
  return match ? { key: match.key, title: match.title } : { key: "default", title: "این صفحه" };
}

export function getQuickQuestions(key: QuickKey): string[] {
  return quickQuestions[key];
}
