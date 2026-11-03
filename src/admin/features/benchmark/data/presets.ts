export type BenchmarkPreset = { id: string; title: string; prompt: string; outputTokens: number; difficulty: number };

/** Questions from the Parsa Polymer scenario; difficulty lowers the score of weaker models. */
export const presets: BenchmarkPreset[] = [
  { id: "rca", title: "تحلیل مردودی بچ", prompt: "علت مردودی بچ B-1405-212 در آزمون MFI (۸٫۹ در برابر حد ۱۰) را از داده‌ی LIMS و روند دمای MES پیدا کن و اقدام اصلاحی پیشنهاد بده.", outputTokens: 700, difficulty: 12 },
  { id: "sop", title: "خلاصه‌ی رویه‌ی QC-SOP-07", prompt: "بند ۴.۲ رویه‌ی کنترل کیفیت ورودی QC-SOP-07 را در پنج خط خلاصه کن.", outputTokens: 260, difficulty: 2 },
  { id: "quote", title: "پیش‌فاکتور ۸۰ تن PE", prompt: "برای سفارش ۸۰ تن PE مشتری، قیمت تمام‌شده و حاشیه‌ی سود را با نرخ امروز مواد اولیه حساب کن و پیش‌فاکتور بنویس.", outputTokens: 520, difficulty: 8 },
  { id: "shortage", title: "پیش‌بینی کمبود مواد", prompt: "با موجودی راهکاران و مصرف روزانه، کمبود مواد اولیه‌ی دو هفته‌ی آینده (به‌ویژه مستربچ مشکی) را پیش‌بینی کن.", outputTokens: 430, difficulty: 6 },
];
