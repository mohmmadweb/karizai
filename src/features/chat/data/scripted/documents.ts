import type { ScriptedReply } from "../../types";

/** «خلاصه‌ی این سند پیوست» with QC-SOP-07 attached (R11.2). */
export const qcSopSummaryReply: ScriptedReply = {
  steps: [
    { id: "d-read", kind: "tool", via: "پیوست: QC-SOP-07 رویه‌ی کنترل کیفیت ورودی", title: "خواندن فایل پیوست", lines: ["۸ صفحه خوانده شد", "متن فارسی و جدول‌ها استخراج شد"], result: "۶ بند اصلی و ۲ فرم پیدا شد." },
    { id: "d-sum", kind: "thinking", title: "خلاصه‌نویسی", lines: ["بندهای اجرایی از توضیحات جدا می‌شود"], result: "خلاصه در ۴ بخش آماده شد." },
  ],
  text: `**خلاصه‌ی «رویه‌ی کنترل کیفیت ورودی QC-SOP-07»**

- **نمونه‌برداری:** از هر محموله دست‌کم ۳ نمونه از کیسه‌های مختلف گرفته می‌شود.
- **آزمون‌های اجباری:** MFI، رطوبت و رنگ؛ نتیجه در فرم QC-F-12 ثبت می‌شود.
- **رطوبت (بند ۶):** ماده‌ی با رطوبت بیش از حد مجاز فقط پس از خشک‌کردن و آزمون دوباره مصرف می‌شود.
- **محموله‌ی مردود:** تا تصمیم کمیته‌ی کیفیت در انبار قرنطینه می‌ماند و به سرپرست کیفیت اطلاع داده می‌شود.`,
  sources: [
    { id: "qc-p2", title: "QC-SOP-07", kind: "document", section: "صفحه‌های ۲ تا ۵", excerpt: "از هر محموله‌ی ورودی دست‌کم سه نمونه از کیسه‌های مختلف برداشته و آزمون‌های MFI، رطوبت و رنگ روی آن انجام شود." },
    { id: "qc-p6", title: "QC-SOP-07", kind: "document", section: "بند ۶: رطوبت", excerpt: "مصرف ماده‌ی با رطوبت بیش از حد مجاز فقط پس از خشک‌کردن و آزمون مجدد رطوبت مجاز است." },
  ],
};

/** Any other attached file: a short summary built from its name. */
export function attachmentSummaryReply(name: string): ScriptedReply {
  return {
    steps: [{ id: "d-read", kind: "tool", via: `پیوست: ${name}`, title: "خواندن فایل پیوست", lines: ["متن فایل استخراج شد"], result: "بخش‌های اصلی فایل پیدا شد." }],
    text: `**خلاصه‌ی «${name}»**\n\n- موضوع اصلی و هدف سند در بخش نخست آمده است.\n- بندهای اجرایی و مسئول هر کار در بخش‌های میانی است.\n- برای پرسش دقیق‌تر، نام بخش یا بند را بنویسید.`,
    sources: [{ id: "att-src", title: name, kind: "document", section: "کل فایل" }],
  };
}
