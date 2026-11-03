import type { NewsCategory, NewsItem } from "../types";

export const categoryLabels: Record<NewsCategory, string> = { quality: "کیفیت", production: "تولید", events: "رویدادها", culture: "فرهنگ سازمانی" };

const news: NewsItem[] = [
  {
    id: "news-1", title: "کاهش ۳۰ درصدی ضایعات خط ۲", category: "quality", publishedAt: "2026-10-27T06:00:00.000Z",
    body: "با اجرای طرح بهبود دمای اکسترودر و نصب حسگر دوم روی قالب، ضایعات خط ۲ در مهرماه از ۳٫۱٪ به ۲٫۲٪ رسید. واحد کیفیت از همکاری تیم‌های تولید و نگهداری قدردانی می‌کند.",
    summary: ["ضایعات خط ۲ در مهرماه از ۳٫۱٪ به ۲٫۲٪ رسید.", "علت: طرح بهبود دمای اکسترودر و حسگر دوم قالب."],
    english: { title: "Line 2 scrap down 30%", body: "After the extruder temperature improvement and a second mold sensor, Line 2 scrap fell from 3.1% to 2.2% in Mehr. The quality team thanks production and maintenance." },
  },
  {
    id: "news-2", title: "افتتاح آزمایشگاه رنگ", category: "production", publishedAt: "2026-10-20T06:00:00.000Z",
    body: "آزمایشگاه رنگ با دستگاه طیف‌سنج تازه افتتاح شد. از این پس اختلاف رنگ (ΔE) هر بچ پیش از بسته‌بندی اندازه‌گیری و در LIMS ثبت می‌شود.",
    summary: ["آزمایشگاه رنگ با طیف‌سنج تازه افتتاح شد.", "ΔE هر بچ پیش از بسته‌بندی اندازه‌گیری و در LIMS ثبت می‌شود."],
    english: { title: "Color lab opens", body: "The new color lab with a spectrophotometer is open. From now on, every batch's color difference (ΔE) is measured before packing and recorded in LIMS." },
  },
  {
    id: "news-3", title: "حضور در نمایشگاه صنایع پلیمر", category: "events", publishedAt: "2026-10-29T06:00:00.000Z",
    body: "پارسا پلیمر شریف ۱۴ آبان در نمایشگاه صنایع پلیمر تهران با گریدهای تازه‌ی PP-T20 حضور دارد. همکاران فروش در غرفه‌ی ۱۲ سالن ۵ میزبان مشتریان‌اند.",
    summary: ["۱۴ آبان، نمایشگاه صنایع پلیمر تهران.", "معرفی گریدهای PP-T20 در غرفه‌ی ۱۲ سالن ۵."],
    english: { title: "At the Polymer Industry Expo", body: "Parsa Polymer Sharif will attend the Tehran Polymer Industry Expo on 14 Aban with the new PP-T20 grades. The sales team hosts customers at booth 12, hall 5." },
  },
  {
    id: "news-4", title: "برگزیدگان طرح پیشنهادها", category: "culture", publishedAt: "2026-10-12T06:00:00.000Z",
    body: "سه پیشنهاد برگزیده‌ی فصل تابستان معرفی شدند؛ پیشنهاد خشک‌کردن مواد پیش از تغذیه‌ی خط ۲ بیشترین اثر را بر کاهش ضایعات داشت.",
    summary: ["سه پیشنهاد برگزیده‌ی تابستان معرفی شدند.", "پیشنهاد خشک‌کردن مواد بیشترین اثر را داشت."],
    english: { title: "Suggestion scheme winners", body: "Three winning suggestions of the summer were announced; drying the material before feeding Line 2 had the largest effect on scrap." },
  },
];

/** The draft «✦ نوشتن خبر با AI» writes from a topic. */
export function draftNews(topic: string): Pick<NewsItem, "title" | "body"> {
  const clean = topic.trim() || "کاهش ضایعات خط ۲ در مهرماه";
  return { title: clean, body: `${clean}: با همکاری واحدهای تولید، کیفیت و نگهداری، نتیجه‌ی این طرح در گزارش‌های مهرماه ثبت شد. ضایعات خط ۲ از ۳٫۱٪ به ۲٫۲٪ رسید و واحد کیفیت از همه‌ی همکاران قدردانی می‌کند.` };
}

export function getNews(): NewsItem[] {
  return news;
}
