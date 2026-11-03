import type { LocalRequest } from "../types";

/** The user whose personal Agents and skills appear in the queue. */
export const currentUserName = "مریم احمدی";

/** Who sent each sample skill or workflow, when it was not the current user. */
export const requesterOf: Record<string, string> = {
  "skill-3": "نرگس حسینی",
  "wf-2": "محمد کاظمی",
};

export const skillConditions: Record<string, string[]> = {
  "skill-3": ["بدون ارسال به سرویس بیرونی", "فقط برای واحد حقوقی و فروش"],
};

/** Requests that only exist on this page: publishing an Agent for everyone, and new connections. */
export function getLocalRequests(): LocalRequest[] {
  return [
    {
      key: "local-agent-letters", type: "agent", title: "نگارنده نامه اداری (نسخه‌ی ۱٫۴)", requester: "مریم احمدی",
      ask: "انتشار برای همه‌ی کارکنان در مخزن عامل‌ها", conditions: ["ارزیابی ۹۱٪ ✦", "فقط مدل داخلی", "۱ ابزار نوشتنی: دیدگاه، ثبت پیش‌نویس"],
      requestedAt: "2026-11-02T10:20:00+03:30",
    },
    {
      key: "local-conn-gitlab", type: "connection", title: "GitLab پروژه‌های نرم‌افزاری", requester: "واحد فناوری",
      ask: "اتصال تازه برای عامل‌های گروه فنی", conditions: ["فقط‌خواندنی", "بدون کلید ادمین", "فقط شبکه‌ی داخلی"],
      requestedAt: "2026-11-01T14:05:00+03:30",
    },
    {
      key: "local-conn-sepidar", type: "connection", title: "سپیدار: ثبت سند حسابداری", requester: "سارا کریمی",
      ask: "مجوز خواندن‌ونوشتن برای گروه مالی", conditions: ["خواندن‌ونوشتن", "سقف هر سند ۵۰۰ میلیون تومان", "هر ثبت با تأیید انسانی"],
      requestedAt: "2026-11-03T09:10:00+03:30",
    },
  ];
}
