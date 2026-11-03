import type { KnowledgeCollection } from "../types";

const collections: KnowledgeCollection[] = [
  { id: "col-quality", title: "فایل‌های کاریز · کیفیت", source: "کاریز (درگاه اسناد)", icon: "folder", countLabel: "۲۳۴ سند", sync: { state: "synced" }, answer: "**مجموعه‌ی «فایل‌های کاریز · کیفیت»**\n\n- ۲۳۴ سند: رویه‌ها (مثل QC-SOP-07)، برگه‌های فنی گریدها و گزارش‌های عدم انطباق.\n- پرتکرارترین موضوع‌ها: رطوبت مواد ورودی، MFI و اختلاف رنگ.\n- تازه‌ترین سند: «گزارش عدم انطباق بچ ۲۱۲» (ساخته‌شده با AI)." },
  { id: "col-rules", title: "آیین‌نامه‌ها و مقررات", source: "کاریز", icon: "folder", countLabel: "۵۸ سند", sync: { state: "synced" }, answer: "**مجموعه‌ی «آیین‌نامه‌ها و مقررات»**\n\n- ۵۸ سند: آیین‌نامه‌ی معاملات، سیاست‌های منابع انسانی و دستورالعمل‌های ایمنی.\n- اسناد محرمانه فقط برای کسانی که اجازه دارند در پاسخ می‌آیند." },
  { id: "col-sharepoint", title: "بایگانی فنی", source: "SharePoint (درگاه اسناد)", icon: "archive", countLabel: "۱٬۲۰۴ سند", sync: { state: "synced", ago: "۲ ساعت پیش" }, answer: "**مجموعه‌ی «بایگانی فنی» (SharePoint)**\n\n- ۱٬۲۰۴ سند: نقشه‌های خط، دفترچه‌های اکسترودر و گزارش‌های پروژه.\n- آخرین همگام‌سازی ۲ ساعت پیش؛ ۱۴ سند تازه و ۳ سند تغییرکرده." },
  { id: "col-didgah", title: "نامه‌های اداری", source: "دیدگاه چارگون", icon: "mail", countLabel: "۳٬۹۱۰ نامه", sync: { state: "synced" }, answer: "**مجموعه‌ی «نامه‌های اداری» (دیدگاه چارگون)**\n\n- ۳٬۹۱۰ نامه؛ فقط نامه‌هایی که در دیدگاه به شما ارجاع شده یا رونوشتش را دارید.\n- بیشترین موضوع در ماه گذشته: تأمین مواد اولیه و قراردادهای خرید." },
  { id: "col-maint-chat", title: "گفتگوهای گروه نگهداری", source: "کاریز (پیام‌ها)", icon: "chat", countLabel: "۶ ماه اخیر", sync: { state: "synced" }, answer: "**مجموعه‌ی «گفتگوهای گروه نگهداری»**\n\n- پیام‌های ۶ ماه اخیر گروه نگهداری.\n- پرتکرارترین موضوع: آلارم E-217 اکسترودر خط ۲ و تعویض گرمکن ناحیه‌ی ۴." },
  { id: "col-ocr", title: "اسناد اسکن‌شده انبار", source: "سرور فایل · OCR فارسی", icon: "scan", countLabel: "۴۱۲ سند", sync: { state: "processing", percent: 80 }, answer: "**مجموعه‌ی «اسناد اسکن‌شده انبار»**\n\n- ۴۱۲ سند اسکن‌شده که متن فارسی‌شان با OCR خوانده می‌شود.\n- ۸۰٪ پردازش شده؛ پاسخ‌ها فعلاً از ۳۳۰ سند ساخته می‌شوند." },
];

export function getKnowledgeCollections(): KnowledgeCollection[] {
  return collections;
}
