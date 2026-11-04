export type TicketStatus = "open" | "answered" | "closed";
export type Ticket = { id: string; subject: string; category: string; priority: "high" | "normal" | "low"; status: TicketStatus; date: string; body: string; reply: string };
export const statusLabels: Record<TicketStatus, string> = { open: "باز", answered: "پاسخ داده شد", closed: "بسته" };
export const priorityLabels = { high: "فوری", normal: "عادی", low: "کم‌اهمیت" } as const;
export const ticketCategories = ["دسترسی و حساب", "اتصال‌ها", "مدل‌ها و دستیار", "گزارش خطا", "سایر"];

export const tickets: Ticket[] = [
  { id: "TK-1405-0112", subject: "دسترسی نوشتن به اتصال سامانه‌ی کنترل کیفیت", category: "اتصال‌ها", priority: "high", status: "open", date: "2026-11-03T09:00:00.000Z", body: "برای ثبت نتیجه‌ی آزمون بچ‌ها فقط دسترسی خواندن دارم.", reply: "سلام. دسترسی شما در گروه «کیفیت و فرمولاسیون» فقط خواندن است. درخواست افزایش دسترسی برای مدیر سیستم ثبت شد و تا پایان روز کاری بررسی می‌شود." },
  { id: "TK-1405-0108", subject: "پاسخ دستیار درباره‌ی QC-SOP-07 منبع نشان نمی‌دهد", category: "مدل‌ها و دستیار", priority: "normal", status: "answered", date: "2026-11-01T09:00:00.000Z", body: "در پاسخ‌ها منبع سند دیده نمی‌شود.", reply: "منبع فقط برای سندهای فهرست‌شده در دانش سازمانی نشان داده می‌شود. سند QC-SOP-07 را به پوشه‌ی کیفیت اضافه کنید تا ایندکس شود." },
  { id: "TK-1405-0101", subject: "تقویم، رویداد تکراری ساخته می‌شود", category: "گزارش خطا", priority: "normal", status: "open", date: "2026-10-29T09:00:00.000Z", body: "با ایجاد جلسه‌ی هفتگی، دو نسخه ثبت می‌شود.", reply: "خطا بازتولید شد و برای تیم توسعه ثبت گردید. تا رفع آن، رویداد تکراری را حذف کنید." },
  { id: "TK-1405-0097", subject: "تغییر نام نمایشی در پروفایل", category: "دسترسی و حساب", priority: "low", status: "closed", date: "2026-10-25T09:00:00.000Z", body: "نام نمایشی را اصلاح کنید.", reply: "نام شما اصلاح شد. در صورت نیاز یک‌بار از حساب خارج و دوباره وارد شوید." },
  { id: "TK-1405-0090", subject: "افزودن مدل داخلی برای داده‌های حساس", category: "مدل‌ها و دستیار", priority: "high", status: "answered", date: "2026-10-20T09:00:00.000Z", body: "برای فرمول کامپاند فقط مدل داخلی استفاده شود.", reply: "برای داده‌های دارای عبارت محرمانه فقط مدل‌های داخلی فعال هستند؛ فرمول کامپاند در سیاست‌ها پنهان‌سازی شده است." },
  { id: "TK-1405-0084", subject: "اتصال تقویم گوگل", category: "اتصال‌ها", priority: "low", status: "closed", date: "2026-10-14T09:00:00.000Z", body: "امکان اتصال تقویم بیرونی هست؟", reply: "در این نسخه تقویم کاری داخلی فعال است و اتصال بیرونی در برنامه‌ی آینده قرار دارد." },
];
