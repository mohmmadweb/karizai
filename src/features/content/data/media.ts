export type MediaType = "image" | "video" | "audio" | "doc";
export type MediaItem = { id: string; title: string; type: MediaType; size: string; date: string; authorId: string };
export const typeLabels: Record<MediaType, string> = { image: "تصویر", video: "ویدیو", audio: "صوت", doc: "سند" };

export const mediaItems: MediaItem[] = [
  { id: "md-1", title: "نمای خط ۲ اکسترودر", type: "image", size: "۲٫۴ مگابایت", date: "2026-11-03T08:00:00.000Z", authorId: "col-reza" },
  { id: "md-2", title: "آموزش تعویض قالب", type: "video", size: "۱۲۴ مگابایت", date: "2026-11-01T08:00:00.000Z", authorId: "col-mehdi" },
  { id: "md-3", title: "نمونه‌ی گرانول PP-H30", type: "image", size: "۱٫۸ مگابایت", date: "2026-10-30T08:00:00.000Z", authorId: "col-narges" },
  { id: "md-4", title: "توضیح رویه‌ی QC-SOP-07", type: "audio", size: "۱۸ مگابایت", date: "2026-10-27T08:00:00.000Z", authorId: "col-narges" },
  { id: "md-5", title: "برگه‌ی مشخصات HD5502", type: "doc", size: "۳۲۰ کیلوبایت", date: "2026-10-24T08:00:00.000Z", authorId: "col-ali" },
  { id: "md-6", title: "بازدید از انبار مستربچ", type: "video", size: "۸۰ مگابایت", date: "2026-10-20T08:00:00.000Z", authorId: "col-sara" },
  { id: "md-7", title: "آزمون ضربه‌ی PP-T20", type: "image", size: "۳٫۱ مگابایت", date: "2026-10-18T08:00:00.000Z", authorId: "col-narges" },
  { id: "md-8", title: "کاتالوگ گریدها", type: "doc", size: "۵٫۲ مگابایت", date: "2026-10-12T08:00:00.000Z", authorId: "col-mohammad" },
  { id: "md-9", title: "نشست هفتگی تولید", type: "audio", size: "۳۴ مگابایت", date: "2026-10-10T08:00:00.000Z", authorId: "col-reza" },
  { id: "md-10", title: "ساختمان کارخانه", type: "image", size: "۴٫۰ مگابایت", date: "2026-10-04T08:00:00.000Z", authorId: "user-1" },
];
