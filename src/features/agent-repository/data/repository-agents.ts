import type { RepositoryAgent } from "../types";

const agents: RepositoryAgent[] = [
  {
    id: "repo-procurement", name: "دستیار سفارش مواد اولیه", category: "تدارک و انبار", rating: 4.7, official: true, author: "واحد تدارک", usage: 86, publishedAt: "2026-10-20T08:00:00.000Z",
    purpose: "موجودی و محموله‌های در راه را کنار هم می‌خواند و می‌گوید چه موادی باید سفارش شود.",
    instructions: "موجودی را از انبار بخوان، محموله‌های باز را از تدارک بیاور و مواد را بر اساس روزهای پوشش مرتب کن. هیچ سفارشی را بدون تأیید کاربر ثبت نکن.",
    defaultModelId: "model-3", tools: [{ connectionId: "conn-12", toolId: "tool-20" }, { connectionId: "conn-13", toolId: "tool-22" }],
  },
  {
    id: "repo-line-alarms", name: "پایشگر شاخص‌های خط", category: "تولید", rating: 4.5, official: true, author: "واحد تولید", usage: 64, publishedAt: "2026-10-18T09:30:00.000Z",
    purpose: "شاخص‌های لحظه‌ای خط را با حد مجاز می‌سنجد و علت احتمالی خروج از حد را می‌نویسد.",
    instructions: "شاخص‌ها را از MES بخوان، آنچه خارج از حد است را بالا بیاور و روند ۲۴ ساعت اخیرش را بررسی کن. علت را فقط به‌عنوان فرضیه بنویس.",
    defaultModelId: "model-3", tools: [{ connectionId: "conn-14", toolId: "tool-24" }, { connectionId: "conn-14", toolId: "tool-25" }],
  },
  {
    id: "repo-incoming-qc", name: "بازرس کیفیت بچ", category: "کیفیت", rating: 4.8, official: true, author: "آزمایشگاه", usage: 52, publishedAt: "2026-10-15T10:00:00.000Z",
    purpose: "نتایج آزمون یک بچ را با فرمول‌های مشابه مقایسه می‌کند و نقطه‌ی ضعف را نشان می‌دهد.",
    instructions: "نتایج آزمون بچ را بخوان، با چند بچ قبلی همان گرید مقایسه کن و اگر مقداری خارج از حد بود، علت‌های محتمل را به ترتیب شواهد بنویس.",
    defaultModelId: "model-3", tools: [{ connectionId: "conn-16", toolId: "tool-28" }, { connectionId: "conn-16", toolId: "tool-29" }],
  },
  {
    id: "repo-maintenance", name: "راهنمای عیب‌یابی دستگاه", category: "نگهداری", rating: 4.6, official: true, author: "واحد نگهداری", usage: 47, publishedAt: "2026-10-12T07:45:00.000Z",
    purpose: "کد آلارم را در گزارش‌های تعمیرات پیدا می‌کند و می‌گوید دفعه‌ی قبل چه شد.",
    instructions: "کد آلارم یا نام دستگاه را در تعمیرات جست‌وجو کن، علت و اقدام دفعه‌ی قبل را خلاصه کن و فهرست بررسی پیش از راه‌اندازی دوباره بده.",
    defaultModelId: "model-3", tools: [{ connectionId: "conn-17", toolId: "tool-30" }],
  },
  {
    id: "repo-quotes", name: "مقایسه‌گر قیمت تامین‌کنندگان", category: "بازرگانی", rating: 4.4, official: true, author: "واحد بازرگانی", usage: 38, publishedAt: "2026-10-09T11:15:00.000Z",
    purpose: "برای یک ماده از چند تامین‌کننده استعلام می‌گیرد و جدول مقایسه می‌سازد.",
    instructions: "نرخ مرجع را بخوان، از تامین‌کنندگان استعلام بگیر و قیمت، زمان تحویل و شرایط پرداخت را در یک جدول بیاور. استعلام فقط با تأیید کاربر ارسال شود.",
    defaultModelId: "model-3", tools: [{ connectionId: "conn-18", toolId: "tool-31" }, { connectionId: "conn-18", toolId: "tool-32" }],
  },
  {
    id: "repo-minutes", name: "صورت‌جلسه‌نویس", category: "مدیریت", rating: 4.9, official: true, author: "دفتر مدیریت", usage: 120, publishedAt: "2026-10-05T08:20:00.000Z",
    purpose: "از متن یا یادداشت‌های جلسه، صورت‌جلسه‌ی مرتب با تصمیم‌ها و اقدام‌ها می‌سازد.",
    instructions: "موضوع‌ها، تصمیم‌ها و اقدام‌های هر نفر را با مهلت فهرست کن. هر چیزی که در متن نیست را حدس نزن و به‌جایش بپرس.",
    defaultModelId: "model-3", tools: [],
  },
  {
    id: "repo-tech-translate", name: "مترجم متن فنی", category: "اداری", rating: 4.3, official: false, author: "واحد تحقیق و توسعه", usage: 74, publishedAt: "2026-10-02T13:00:00.000Z",
    purpose: "برگه‌های فنی و ایمیل‌های تامین‌کنندگان را به فارسی روان ترجمه می‌کند.",
    instructions: "اصطلاح‌های فنی پلیمر را دقیق ترجمه کن و برای اصطلاح مبهم، معادل انگلیسی را در پرانتز بیاور. اعداد و واحدها را تغییر نده.",
    defaultModelId: "model-10", tools: [],
  },
  {
    id: "repo-letters", name: "نگارنده‌ی نامه‌ی اداری", category: "اداری", rating: 4.6, official: false, author: "دبیرخانه", usage: 95, publishedAt: "2026-09-28T09:00:00.000Z",
    purpose: "نامه‌ی رسمی را با قالب سازمان در سه بخش موضوع، متن و پایان می‌نویسد.",
    instructions: "نامه را با لحن رسمی و در سه بخش موضوع، متن و پایان بنویس و شماره و تاریخ را خالی بگذار تا کاربر پر کند.",
    defaultModelId: "model-10", tools: [],
  },
  {
    id: "repo-shift-report", name: "گزارش‌ساز شیفت", category: "تولید", rating: 4.2, official: true, author: "واحد تولید", usage: 41, publishedAt: "2026-09-25T06:30:00.000Z",
    purpose: "از شاخص‌های شیفت، گزارش کوتاه تحویل شیفت را آماده می‌کند.",
    instructions: "شاخص‌های شیفت را بخوان و گزارش را در سه بخش بنویس: وضعیت کلی، موارد خارج از حد، و کارهای نیمه‌تمام برای شیفت بعد.",
    defaultModelId: "model-3", tools: [{ connectionId: "conn-14", toolId: "tool-24" }],
  },
  {
    id: "repo-incident", name: "تحلیل‌گر گزارش حادثه", category: "ایمنی", rating: 4.5, official: true, author: "واحد HSE", usage: 22, publishedAt: "2026-09-20T08:00:00.000Z",
    purpose: "الگوهای تکرارشونده و علل ریشه‌ای را در گزارش‌های حادثه و شبه‌حادثه‌ی HSE پیدا می‌کند.",
    instructions: "گزارش‌های حادثه را بخوان، آن‌ها را بر اساس محل، دستگاه و نوع خطر دسته‌بندی کن و علت‌های تکرارشونده را با تعداد و نمونه بنویس. نام افراد را در خروجی نیاور.",
    defaultModelId: "model-8", tools: [],
  },
  {
    id: "repo-regulations", name: "پاسخگوی آیین‌نامه‌ها", category: "اداری", rating: 4.7, official: true, author: "منابع انسانی", usage: 95, publishedAt: "2026-09-18T09:00:00.000Z",
    purpose: "به پرسش‌های اداری و منابع انسانی با ارجاع به بند آیین‌نامه پاسخ می‌دهد.",
    instructions: "فقط از آیین‌نامه‌ها و مقررات سازمان پاسخ بده و شماره‌ی بند را بیاور. اگر پاسخ در اسناد نبود، بگو و به منابع انسانی ارجاع بده.",
    defaultModelId: "model-8", tools: [],
  },
];

export function getRepositoryAgents(): RepositoryAgent[] {
  return agents;
}

/** Category tabs, in the order of the plant's units. */
export const repositoryCategories = ["همه", "تولید", "کیفیت", "نگهداری", "تدارک و انبار", "بازرگانی", "ایمنی", "اداری", "مدیریت"];
