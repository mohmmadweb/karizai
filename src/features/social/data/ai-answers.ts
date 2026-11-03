import type { SuggestedTask } from "../types";

/** Root-cause analysis of the rejected batch, the same case the quality Agent answers in the chat. */
export const batchAnalysis = {
  batch: "B-1405-2217",
  question: "در بچ B-1405-2217 کامپاند PP مشکی لکه‌ی تیره دیده شده و رنگ مردود شد. علت احتمالی چیست؟",
  facts: ["اختلاف رنگ ΔE برابر ۲٫۹ است (حداکثر مجاز ۱٫۵)؛ MFI ۱۱٫۸ و ضربه در حد مجاز.", "پنج بچ قبلی همین گرید ΔE بین ۰٫۸ و ۱٫۲ داشتند."],
  causes: ["پخش ناکامل مستربچ مشکیِ تأمین‌کننده‌ی تازه (از ۱۲ آبان مصرف می‌شود).", "دمای ناحیه‌ی ۴ اکسترودر ۸ درجه بالاتر از معمول (۲۴۸ درجه در برابر حد ۲۴۰)."],
  actions: ["یک نمونه با مستربچ قبلی بسازید و ΔE را مقایسه کنید.", "دمای ناحیه‌ی ۴ را به ۲۳۵ درجه برگردانید.", "رطوبت گرانول بچ را اندازه بگیرید."],
  sources: ["LIMS: آزمون بچ B-1405-2217", "MES: روند دمای ناحیه‌ی ۴", "QC-SOP-07 بند ۴.۲"],
  correctiveTask: { title: "اقدام اصلاحی بچ B-1405-2217: نمونه با مستربچ قبلی", assigneeId: "col-narges", dueDate: "2026-11-05T00:00:00.000Z", projectId: "proj-5" } satisfies SuggestedTask,
};

/** Agenda of the quality review meeting, for «✦ دستور جلسه». */
export const qualityAgenda = [
  "مرور مردودی بچ B-1405-2217 و نتیجه‌ی تحلیل علت (۱۰ دقیقه)",
  "تأخیر تأمین مستربچ مشکی و تصمیم درباره‌ی آزمون گرید جایگزین (۱۵ دقیقه)",
  "بازنگری بند ۴.۲ رویه‌ی QC-SOP-07 (۱۰ دقیقه)",
  "مرور وظایف باز پروژه‌ی «بهبود کیفیت ۱۴۰۵» (۵ دقیقه)",
];

/** Sample minutes the user can paste in «✦ وظایف از صورت‌جلسه». */
export const sampleMinutes = `صورت‌جلسه‌ی بازبینی کیفیت · ۱۱ آبان ۱۴۰۵
- تصمیم: آزمون گرید جایگزین مستربچ روی خط ۲ انجام شود؛ مسئول رضا محمدی تا ۱۵ آبان.
- استعلام از دو تأمین‌کننده‌ی تازه‌ی مستربچ مشکی؛ مسئول علی رضایی تا ۱۴ آبان.
- بازنگری بند ۴.۲ رویه‌ی QC-SOP-07؛ مسئول مریم احمدی تا ۲۰ آبان.
- کالیبراسیون حسگر دمای ناحیه‌ی ۴؛ مسئول مهدی صادقی تا ۱۳ آبان.`;

/** The four tasks the assistant finds in the sample minutes. */
export const minutesTasks: SuggestedTask[] = [
  { title: "آزمون گرید جایگزین مستربچ روی خط ۲", assigneeId: "col-reza", dueDate: "2026-11-06T00:00:00.000Z", projectId: "proj-5" },
  { title: "استعلام از دو تأمین‌کننده‌ی تازه‌ی مستربچ مشکی", assigneeId: "col-ali", dueDate: "2026-11-05T00:00:00.000Z", projectId: "proj-5" },
  { title: "بازنگری بند ۴.۲ رویه‌ی QC-SOP-07", assigneeId: "user-1", dueDate: "2026-11-11T00:00:00.000Z", projectId: "proj-5" },
  { title: "کالیبراسیون حسگر دمای ناحیه‌ی ۴", assigneeId: "col-mehdi", dueDate: "2026-11-04T00:00:00.000Z", projectId: "proj-5" },
];
