export type Category = { id: string; name: string; parentId: string | null; items: number; kind: string };
export const categories: Category[] = [
  { id: "c-1", name: "محصولات", parentId: null, items: 24, kind: "کالا" },
  { id: "c-2", name: "پلی‌پروپیلن (PP)", parentId: "c-1", items: 12, kind: "کالا" },
  { id: "c-3", name: "پلی‌اتیلن (PE)", parentId: "c-1", items: 8, kind: "کالا" },
  { id: "c-4", name: "مستربچ", parentId: "c-1", items: 4, kind: "کالا" },
  { id: "c-5", name: "کیفیت", parentId: null, items: 31, kind: "سند" },
  { id: "c-6", name: "رویه‌ها (QC-SOP)", parentId: "c-5", items: 14, kind: "سند" },
  { id: "c-7", name: "گزارش آزمون", parentId: "c-5", items: 17, kind: "سند" },
  { id: "c-8", name: "تولید", parentId: null, items: 19, kind: "سند" },
  { id: "c-9", name: "خط ۲ اکسترودر", parentId: "c-8", items: 11, kind: "سند" },
  { id: "c-10", name: "تأمین و انبار", parentId: null, items: 9, kind: "سند" },
];
