export type CompareTask = { id: string; title: string; prompt: string; inputTokens: number; outputTokens: number };

const tasks: CompareTask[] = [
  { id: "summary", title: "خلاصه‌سازی یک سند فنی", prompt: "برگه‌ی فنی گرید PP-T20 را در یک صفحه خلاصه کن و مقادیر کلیدی را در جدول بیاور.", inputTokens: 5200, outputTokens: 700 },
  { id: "stock", title: "گزارش وضعیت موجودی مواد اولیه", prompt: "موجودی، مصرف ۳۰ روز اخیر و محموله‌های در راه مواد اولیه را جمع کن و پیشنهاد سفارش بنویس.", inputTokens: 3800, outputTokens: 1300 },
  { id: "invoice", title: "پیش‌فاکتور ۲۰ تن PP-T20", prompt: "برای آریاپلاست قیمت ۲۰ تن PP-T20 را حساب و پیش‌فاکتور را آماده کن.", inputTokens: 2600, outputTokens: 900 },
];

export const getCompareTasks = (): CompareTask[] => tasks;
