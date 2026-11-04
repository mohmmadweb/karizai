import type { ScriptedEntry, ScriptedReply } from "../../types";

/** Questions the user can type for the warehouse and procurement databases. */
export const reorderQuestion = "کدام مواد اولیه به نقطه‌ی سفارش رسیده‌اند و موجودی هرکدام چقدر است؟";
export const inTransitQuestion = "از این سه ماده، کدام محموله‌شان در راه است و کی می‌رسد؟";

export const reorderReply: ScriptedReply = {
  steps: [
    { id: "wh-think", kind: "thinking", title: "فهمیدن پرسش", lines: ["کلیدواژه‌ها: موجودی و نقطه‌ی سفارش", "نیاز به دو جدول: موجودی فعلی و حدود سفارش"], result: "پرسش به یک کوئری فقط‌خواندنی روی دو جدول تبدیل می‌شود." },
    { id: "wh-schema", kind: "tool", via: "اتصال: انبار و موجودی (SQL Server)", title: "خواندن ساختار پایگاه انبار", lines: ["جدول‌های InventoryStock و ReorderPolicy پیدا شد", "ستون‌های مقدار، واحد و حد سفارش شناسایی شد"], result: "۲ جدول و ۹ ستون مرتبط پیدا شد." },
    { id: "wh-query", kind: "tool", via: "اتصال: انبار و موجودی (SQL Server)", title: "اجرای کوئری فقط‌خواندنی", lines: ["اجرا روی SQL Server انبار مرکزی", "۶ ردیف برگشت"], result: "۶ ماده‌ی اولیه بررسی شد؛ ۳ مورد زیر نقطه‌ی سفارش است." },
    { id: "wh-analyze", kind: "thinking", title: "تحلیل نتیجه", lines: ["پوشش روزانه با میانگین مصرف ۳۰ روز اخیر حساب می‌شود", "مواد بر اساس فوریت مرتب می‌شوند"], result: "ترتیب فوریت: HD5502، سپس POE و بعد H350." },
  ],
  structured: {
    query: "SELECT m.Name, s.QtyTon, p.ReorderPointTon, s.QtyTon / u.AvgDailyTon AS CoverDays\nFROM InventoryStock s\nJOIN ReorderPolicy p ON p.MaterialId = s.MaterialId\nJOIN Materials m ON m.Id = s.MaterialId\nJOIN AvgUsage30d u ON u.MaterialId = s.MaterialId\nORDER BY CoverDays",
    columns: ["ماده‌ی اولیه", "موجودی (تن)", "نقطه‌ی سفارش (تن)", "پوشش (روز)", "وضعیت"],
    rows: [
      ["PE سنگین HD5502", 18, 40, 3, "بحرانی"],
      ["POE الاستومر", 4, 8, 4, "نیاز به سفارش"],
      ["PP هموپلیمر H350", 42, 60, 5, "نیاز به سفارش"],
      ["آنتی‌اکسیدان B215", 1.4, 1, 6, "کافی"],
      ["تالک میکرونیزه", 24, 20, 11, "کافی"],
      ["مستربچ مشکی ۴۰٪", 6.5, 5, 14, "کافی"],
    ],
    suggested: "table",
  },
  text: `از شش ماده‌ی اولیه، **سه ماده زیر نقطه‌ی سفارش** است:

- **PE سنگین HD5502** فقط ۳ روز پوشش دارد و بحرانی است.
- **POE الاستومر** ۴ روز پوشش دارد.
- **PP هموپلیمر H350** ۵ روز پوشش دارد.

زمان تحویل تامین‌کنندگان معمولاً ۷ تا ۱۰ روز است، پس حتی با سفارش امروز احتمال کمبود HD5502 و POE وجود دارد. پیش از ثبت سفارش، محموله‌های در راه را بررسی کنید؛ اگر اتصال «تدارک و خرید» را هم روشن کنید، همین را از پایگاه تدارک می‌پرسم.`,
};

export const inTransitReply: ScriptedReply = {
  steps: [
    { id: "pr-think", kind: "thinking", title: "فهمیدن پرسش", lines: ["مواد مورد نظر از پاسخ قبلی گرفته می‌شود", "نیاز به سفارش‌های خرید باز و وضعیت حمل"], result: "سه ماده‌ی کم‌موجودی با سفارش‌های باز تطبیق داده می‌شود." },
    { id: "pr-schema", kind: "tool", via: "اتصال: تدارک و خرید (SQL Server)", title: "خواندن ساختار پایگاه تدارک", lines: ["جدول‌های PurchaseOrder و Shipment پیدا شد"], result: "۲ جدول و ۸ ستون مرتبط پیدا شد." },
    { id: "pr-query", kind: "tool", via: "اتصال: تدارک و خرید (SQL Server)", title: "اجرای کوئری فقط‌خواندنی", lines: ["اجرا روی SQL Server تدارک", "سفارش‌های باز و محموله‌ها پیوند داده می‌شود"], result: "۴ محموله‌ی باز پیدا شد." },
    { id: "pr-compare", kind: "thinking", title: "مقایسه با پوشش موجودی", lines: ["تاریخ ورود با روزهای پوشش مقایسه می‌شود"], result: "برای HD5502 حدود ۸ روز فاصله‌ی بدون موجودی پیش‌بینی می‌شود." },
  ],
  structured: {
    query: "SELECT po.Code, m.Name, po.QtyTon, v.Name AS Vendor, sh.Status, sh.EtaDate\nFROM PurchaseOrder po\nJOIN Shipment sh ON sh.PoId = po.Id\nJOIN Vendors v ON v.Id = po.VendorId\nJOIN Materials m ON m.Id = po.MaterialId\nWHERE po.Closed = 0 ORDER BY sh.EtaDate",
    columns: ["سفارش خرید", "ماده", "مقدار (تن)", "تامین‌کننده", "وضعیت حمل", "ورود تخمینی"],
    rows: [
      ["PO-1405-0412", "PP هموپلیمر H350", 120, "شیمی‌پلاست البرز", "در مسیر جاده‌ای", "۱۶ آبان"],
      ["PO-1405-0415", "PE سنگین HD5502", 80, "پلیمر خزر", "در ترخیص گمرک بندرعباس", "۱۸ آبان"],
      ["PO-1405-0419", "مستربچ مشکی ۴۰٪", 5, "رنگ‌آفرین نوین", "در حال تولید نزد تامین‌کننده", "۲۰ آبان"],
      ["PO-1405-0418", "POE الاستومر", 10, "Sinopoly (چین)", "در دریا", "۲۹ آبان"],
    ],
    suggested: "table",
  },
  text: `وضعیت سه ماده‌ی کم‌موجودی:

- **PP هموپلیمر H350‏:** ۱۲۰ تن تا ۱۶ آبان می‌رسد؛ با پوشش ۵ روزه مشکلی پیش نمی‌آید.
- **PE سنگین HD5502‏:** ۸۰ تن هنوز در ترخیص گمرک است و تا ۱۸ آبان نمی‌رسد. با مصرف فعلی حدود **۸ روز بدون موجودی** می‌مانیم.
- **POE الاستومر:** محموله‌ی ۱۰ تنی در دریاست و تا ۲۹ آبان نمی‌رسد؛ پوشش ۴ روزه کافی نیست.

پیشنهاد: ترخیص HD5502 را اولویت بدهید یا ۱۰ تن از بازار داخلی بخرید، و برای POE یک جایگزین داخلی یا سفارش هوایی کوچک بررسی کنید.`,
};

const hint = (area: string, example: string): ScriptedReply => ({
  steps: [
    { id: "hint-think", kind: "thinking", title: "فهمیدن پرسش", lines: ["پرسش با جدول‌های پایگاه انتخاب‌شده مقایسه می‌شود"], result: `جدول مناسبی برای این پرسش در پایگاه ${area} پیدا نشد.` },
  ],
  text: `برای این پرسش جدول مناسبی در پایگاه ${area} پیدا نکردم و ترجیح می‌دهم کوئری حدسی نزنم. پرسش را با نام ماده یا شاخص دقیق‌تر بنویسید؛ مثلاً «${example}».`,
});

export const warehouseEntries: ScriptedEntry[] = [
  { scope: { connectionId: "conn-12" }, match: /(نقطه.?سفارش|موجودی|پوشش|reorder)/i, reply: reorderReply },
  { scope: { connectionId: "conn-12" }, reply: hint("انبار", reorderQuestion) },
  { scope: { connectionId: "conn-13" }, match: /(در راه|محموله|کجاست|ترخیص|سفارش خرید)/, reply: inTransitReply },
  { scope: { connectionId: "conn-13" }, reply: hint("تدارک", inTransitQuestion) },
];
