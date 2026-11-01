import type { KnowledgeDocument } from "../types";

const documents: KnowledgeDocument[] = [
  { id: "doc-1", title: "آیین‌نامه‌ی معاملات سازمان", source: "پوشه‌ی مقررات", collection: "مقررات", updatedAt: "2026-09-12T08:00:00.000Z" },
  { id: "doc-2", title: "راهنمای کارکنان سازمان", source: "پوشه‌ی منابع انسانی", collection: "منابع انسانی", updatedAt: "2026-10-02T10:30:00.000Z" },
  { id: "doc-3", title: "گزارش فروش فصل سوم", source: "سرور فایل مالی", collection: "گزارش‌ها", updatedAt: "2026-10-10T07:15:00.000Z" },
  { id: "doc-4", title: "دستورالعمل امنیت اطلاعات", source: "پوشه‌ی مقررات", collection: "مقررات" },
  { id: "doc-5", title: "فهرست قیمت محصولات", source: "سرور فایل فروش", collection: "فروش", updatedAt: "2026-08-25T12:00:00.000Z" },
  { id: "doc-6", title: "برگه‌ی فنی مستربچ مشکی ۴۰٪", source: "پوشه‌ی کیفیت", collection: "کیفیت", updatedAt: "2026-07-14T08:00:00.000Z" },
  { id: "doc-7", title: "برگه‌ی فنی گرید PP-T20", source: "پوشه‌ی کیفیت", collection: "کیفیت", updatedAt: "2026-08-02T09:30:00.000Z" },
  { id: "doc-8", title: "دستورالعمل انبارش مواد اولیه و مستربچ", source: "پوشه‌ی انبار", collection: "انبار", updatedAt: "2026-06-21T07:00:00.000Z" },
  { id: "doc-9", title: "رویه‌ی کنترل کیفیت ورودی (QC-SOP-07)", source: "پوشه‌ی کیفیت", collection: "کیفیت", updatedAt: "2026-09-05T10:00:00.000Z" },
  { id: "doc-10", title: "راهنمای عیب‌یابی اکسترودر ZSK", source: "پوشه‌ی نگهداری", collection: "نگهداری", updatedAt: "2026-05-18T11:00:00.000Z" },
  { id: "doc-11", title: "برگه‌ی ایمنی مواد (SDS) گریدهای PP", source: "پوشه‌ی ایمنی", collection: "ایمنی", updatedAt: "2026-04-09T08:30:00.000Z" },
  { id: "doc-12", title: "سیاست قیمت‌گذاری و تخفیف فروش", source: "سرور فایل فروش", collection: "فروش", updatedAt: "2026-09-28T12:00:00.000Z" },
];

/** Documents the current user is allowed to read. */
export function getKnowledgeDocuments(): KnowledgeDocument[] {
  return documents;
}
