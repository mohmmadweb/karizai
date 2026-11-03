import type { KnowledgeDocument } from "../types";

const quality = { type: "رویه‌ی اجرایی", owner: "واحد کیفیت", confidentiality: "داخلی" };

const documents: KnowledgeDocument[] = [
  { id: "doc-9", title: "QC-SOP-07 رویه‌ی کنترل کیفیت ورودی", source: "پوشه‌ی کیفیت", collection: "کیفیت", updatedAt: "2026-09-05T10:00:00.000Z", kind: "pdf", sizeKb: 198, tags: ["رویه", "کیفیت", "داخلی"], summary: "نمونه‌برداری دست‌کم ۳ نمونه از هر محموله؛ آزمون اجباری MFI، رطوبت و رنگ؛ محموله‌ی مردود در قرنطینه می‌ماند.", keywords: ["رطوبت", "مواد ورودی", "نمونه‌برداری", "MFI", "قرنطینه", "کنترل کیفیت"], meta: { ...quality, code: "QC-SOP-07" } },
  { id: "doc-7", title: "برگه‌ی فنی گرید PP-T20", source: "پوشه‌ی کیفیت", collection: "کیفیت", updatedAt: "2026-08-02T09:30:00.000Z", kind: "pdf", sizeKb: 388, tags: ["برگه فنی", "محصول"], summary: "مشخصات گرید PP-T20: MFI حدود ۱۲، ضربه‌ی آیزود ۵۲ و مدول خمشی ۱۹۰۰ مگاپاسکال.", keywords: ["MFI", "ضربه", "گرید", "خواص"], meta: { type: "برگه‌ی فنی محصول", code: "TDS-PP-T20", owner: "واحد تحقیق و توسعه", confidentiality: "داخلی" } },
  { id: "doc-13", title: "گزارش عدم انطباق بچ ۲۱۲", source: "پوشه‌ی کیفیت", collection: "کیفیت", updatedAt: "2026-11-01T08:00:00.000Z", kind: "word", sizeKb: 96, tags: ["ساخته‌شده با AI"], summary: "MFI بچ B-1405-212 برابر ۸٫۹ و خارج از حد؛ علت محتمل دمای ناحیه‌ی ۴ و رطوبت مواد.", keywords: ["مردود", "بچ", "MFI", "دما", "رطوبت"], meta: { type: "گزارش عدم انطباق", code: "NCR-212", owner: "واحد کیفیت", confidentiality: "داخلی" } },
  { id: "doc-14", title: "نتایج آزمون مهر", source: "پوشه‌ی کیفیت", collection: "کیفیت", updatedAt: "2026-10-23T12:00:00.000Z", kind: "excel", sizeKb: 254, tags: ["داده", "آزمایشگاه"], summary: "نتایج MFI، رطوبت، ΔE و ضربه‌ی ۴۸ بچ در مهرماه.", keywords: ["آزمون", "رطوبت", "MFI", "آزمایشگاه"], meta: { type: "داده‌ی آزمایشگاه", owner: "آزمایشگاه", confidentiality: "داخلی" } },
  { id: "doc-6", title: "برگه‌ی فنی مستربچ مشکی ۴۰٪", source: "پوشه‌ی کیفیت", collection: "کیفیت", updatedAt: "2026-07-14T08:00:00.000Z", kind: "pdf", sizeKb: 412, tags: ["برگه فنی", "مواد اولیه"], summary: "حداکثر رطوبت پیش از فرایند ۰٫۰۵٪؛ خشک‌کردن ۳ تا ۴ ساعت در ۸۰ تا ۹۰ درجه.", keywords: ["رطوبت", "مستربچ", "خشک‌کردن", "مواد ورودی"], meta: { type: "برگه‌ی فنی", owner: "تأمین‌کننده", confidentiality: "عمومی" } },
  { id: "doc-8", title: "دستورالعمل انبارش مواد اولیه و مستربچ", source: "پوشه‌ی انبار", collection: "انبار", updatedAt: "2026-06-21T07:00:00.000Z", kind: "word", sizeKb: 276, tags: ["دستورالعمل", "انبار"], summary: "نگهداری روی پالت، زیر ۴۰ درجه و دور از نور؛ بسته‌ی بازشده حداکثر ۴۸ ساعت.", keywords: ["انبار", "نگهداری", "رطوبت", "مستربچ"], meta: { type: "دستورالعمل", owner: "انبار", confidentiality: "داخلی" } },
  { id: "doc-10", title: "راهنمای عیب‌یابی اکسترودر ZSK", source: "پوشه‌ی نگهداری", collection: "نگهداری", updatedAt: "2026-05-18T11:00:00.000Z", kind: "pdf", sizeKb: 2150, tags: ["راهنما", "نگهداری"], summary: "کدهای آلارم اکسترودر و اقدام‌های عیب‌یابی گرمکن‌ها، گیربکس و فشار قالب.", keywords: ["آلارم", "اکسترودر", "دما", "گرمکن"], meta: { type: "راهنمای فنی", owner: "واحد نگهداری", confidentiality: "داخلی" } },
  { id: "doc-11", title: "برگه‌ی ایمنی مواد (SDS) گریدهای PP", source: "پوشه‌ی ایمنی", collection: "ایمنی", updatedAt: "2026-04-09T08:30:00.000Z", kind: "pdf", sizeKb: 864, tags: ["ایمنی"], summary: "خطرها، کمک‌های اولیه و شرایط انبارش ایمن گریدهای PP.", keywords: ["ایمنی", "انبار", "آتش"], meta: { type: "برگه‌ی ایمنی", owner: "HSE", confidentiality: "عمومی" } },
  { id: "doc-15", title: "دستورالعمل ایمنی کارخانه", source: "پوشه‌ی ایمنی", collection: "ایمنی", updatedAt: "2026-10-17T08:00:00.000Z", kind: "pdf", sizeKb: 8190, tags: ["ایمنی", "دستورالعمل"], summary: "قواعد ایمنی سالن تولید، تجهیزات حفاظت فردی و گزارش حادثه.", keywords: ["ایمنی", "حادثه"], meta: { type: "دستورالعمل", owner: "HSE", confidentiality: "داخلی" }, adminDocId: "doc-007" },
  { id: "doc-1", title: "آیین‌نامه‌ی معاملات سازمان", source: "پوشه‌ی مقررات", collection: "مقررات", updatedAt: "2026-09-12T08:00:00.000Z", kind: "word", sizeKb: 482, tags: ["آیین‌نامه"], summary: "سقف معاملات، کمیته‌ی معاملات و روش استعلام.", keywords: ["معامله", "خرید", "استعلام"], meta: { type: "آیین‌نامه", owner: "امور مالی", confidentiality: "داخلی" } },
  { id: "doc-16", title: "سیاست‌های منابع انسانی", source: "پوشه‌ی منابع انسانی", collection: "منابع انسانی", updatedAt: "2026-10-02T08:30:00.000Z", kind: "pdf", sizeKb: 2400, tags: ["منابع انسانی"], summary: "مرخصی، اضافه‌کار، ارزیابی عملکرد و حقوق.", keywords: ["مرخصی", "حقوق", "کارکنان"], meta: { type: "سیاست", owner: "منابع انسانی", confidentiality: "محرمانه" }, adminDocId: "doc-001" },
  { id: "doc-17", title: "قرارداد تأمین مواد اولیه", source: "پوشه‌ی تدارکات", collection: "تدارکات", updatedAt: "2026-10-11T09:00:00.000Z", kind: "word", sizeKb: 1100, tags: ["قرارداد", "تأمین"], summary: "قرارداد ۱۲ماهه‌ی تأمین PP و مستربچ با جریمه‌ی تأخیر روزانه.", keywords: ["قرارداد", "تأمین", "مستربچ", "تأخیر"], meta: { type: "قرارداد", owner: "تدارکات", confidentiality: "محرمانه" }, adminDocId: "doc-003" },
  { id: "doc-18", title: "گزارش فروش مهر", source: "سرور فایل فروش", collection: "فروش", updatedAt: "2026-10-14T11:10:00.000Z", kind: "excel", sizeKb: 640, tags: ["داده", "فروش"], summary: "فروش مهرماه به تفکیک مشتری و گرید.", keywords: ["فروش", "مشتری"], meta: { type: "گزارش", owner: "واحد فروش", confidentiality: "داخلی" }, adminDocId: "doc-004" },
  { id: "doc-12", title: "سیاست قیمت‌گذاری و تخفیف فروش", source: "سرور فایل فروش", collection: "فروش", updatedAt: "2026-09-28T12:00:00.000Z", kind: "word", sizeKb: 142, tags: ["سیاست", "فروش"], summary: "حاشیه‌ی سود هدف و سقف تخفیف به تفکیک مشتری.", keywords: ["قیمت", "تخفیف", "فروش"], meta: { type: "سیاست", owner: "واحد فروش", confidentiality: "داخلی" } },
];

/** Documents the current user is allowed to read. */
export function getKnowledgeDocuments(): KnowledgeDocument[] {
  return documents;
}

export function getKnowledgeDocument(id: string): KnowledgeDocument | undefined {
  return documents.find((doc) => doc.id === id);
}

/** True when the admin marked the document confidential (`usePolicies().confidentialDocIds`). */
export function isConfidentialDocument(doc: KnowledgeDocument, confidentialDocIds: string[]): boolean {
  return confidentialDocIds.includes(doc.adminDocId ?? doc.id);
}
