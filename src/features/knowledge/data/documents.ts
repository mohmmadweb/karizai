import type { KnowledgeDocument } from "../types";

const documents: KnowledgeDocument[] = [
  { id: "doc-001", title: "آیین‌نامه‌ی معاملات سازمان", source: "پوشه‌ی مقررات", collection: "مقررات", updatedAt: "2026-09-12T08:00:00.000Z", kind: "word", sizeKb: 482 },
  { id: "doc-002", title: "راهنمای کارکنان سازمان", source: "پوشه‌ی منابع انسانی", collection: "منابع انسانی", updatedAt: "2026-10-02T10:30:00.000Z", kind: "word", sizeKb: 1240 },
  { id: "doc-003", title: "قرارداد تأمین مواد اولیه", source: "سرور فایل تدارک", collection: "قراردادها", updatedAt: "2026-10-08T09:00:00.000Z", kind: "word", sizeKb: 1126, confidential: true },
  { id: "doc-004", title: "دستورالعمل امنیت اطلاعات", source: "پوشه‌ی مقررات", collection: "مقررات", kind: "word", sizeKb: 236 },
  { id: "doc-005", title: "فهرست قیمت محصولات", source: "سرور فایل فروش", collection: "فروش", updatedAt: "2026-08-25T12:00:00.000Z", kind: "excel", sizeKb: 154 },
  { id: "doc-006", title: "برگه‌ی فنی مستربچ مشکی ۴۰٪", source: "پوشه‌ی کیفیت", collection: "کیفیت", updatedAt: "2026-07-14T08:00:00.000Z", kind: "word", sizeKb: 412 },
  { id: "doc-007", title: "برگه‌ی فنی گرید PP-T20", source: "پوشه‌ی کیفیت", collection: "کیفیت", updatedAt: "2026-08-02T09:30:00.000Z", kind: "word", sizeKb: 388 },
  { id: "doc-008", title: "دستورالعمل انبارش مواد اولیه و مستربچ", source: "پوشه‌ی انبار", collection: "انبار", updatedAt: "2026-06-21T07:00:00.000Z", kind: "word", sizeKb: 276 },
  { id: "doc-009", title: "رویه‌ی کنترل کیفیت ورودی (QC-SOP-07)", source: "پوشه‌ی کیفیت", collection: "کیفیت", updatedAt: "2026-09-05T10:00:00.000Z", kind: "word", sizeKb: 198 },
  { id: "doc-010", title: "راهنمای عیب‌یابی اکسترودر ZSK", source: "پوشه‌ی نگهداری", collection: "نگهداری", updatedAt: "2026-05-18T11:00:00.000Z", kind: "word", sizeKb: 2150 },
  { id: "doc-011", title: "برگه‌ی ایمنی مواد (SDS) گریدهای PP", source: "پوشه‌ی ایمنی", collection: "ایمنی", updatedAt: "2026-04-09T08:30:00.000Z", kind: "word", sizeKb: 864 },
  { id: "doc-012", title: "سیاست قیمت‌گذاری و تخفیف فروش", source: "سرور فایل فروش", collection: "فروش", updatedAt: "2026-09-28T12:00:00.000Z", kind: "word", sizeKb: 142 },
  { id: "doc-013", title: "گزارش فروش فصل سوم", source: "سرور فایل مالی", collection: "گزارش‌ها", updatedAt: "2026-10-10T07:15:00.000Z", kind: "excel", sizeKb: 318 },
];

/** Documents the current user is allowed to read. */
export function getKnowledgeDocuments(): KnowledgeDocument[] {
  return documents;
}
