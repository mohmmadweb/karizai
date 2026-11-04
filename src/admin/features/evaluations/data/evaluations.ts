export type EvalStatus = "published" | "ready" | "blocked";

export type EvalRow = {
  id: string;
  agent: string;
  version: string;
  model: string;
  setSize: number;
  /** 0..1, last run of the published version. */
  accuracy: number;
  /** 0..1, the version before it. */
  previous: number;
  /** A new version or model change waiting to pass the evaluation. */
  candidate?: { version: string; change: string; passRate: number; result?: number };
  status: EvalStatus;
  /** Questions of the set; `{n}` is replaced with a number so the set reaches `setSize`. */
  questions: string[];
};

export type EvalCase = { id: string; question: string; pass: boolean };

const rows: EvalRow[] = [
  {
    id: "ev-quality", agent: "دستیار کیفیت و فرمولاسیون", version: "1.3", model: "Qwen 32B", setSize: 12, accuracy: 0.92, previous: 0.92, status: "published",
    candidate: { version: "1.4", change: "افزودن جست‌وجوی فرمول‌های مشابه", passRate: 0.93 },
    questions: ["علت مردودی بچ ۲{n}۰ چیست؟", "MFI بچ ۲{n}۲ خارج از حد است؛ چه کنیم؟", "رسپی جایگزین برای PP-T20 با تالک کمتر", "طبق QC-SOP-07 آزمون ضربه‌ی بچ {n} کافی است؟"],
  },
  {
    id: "ev-maint", agent: "دستیار نگهداری و تعمیرات", version: "1.1", model: "Qwen 32B", setSize: 15, accuracy: 0.88, previous: 0.86, status: "published",
    questions: ["آلارم E-{n}4 اکسترودر ۲ چیست؟", "دفعه‌ی قبل لرزش گیربکس خط {n} را چطور رفع کردیم؟", "برنامه‌ی تعویض المنت ناحیه‌ی {n}"],
  },
  {
    id: "ev-indicators", agent: "تحلیل‌گر شاخص‌های تولید", version: "2.0", model: "Qwen 32B", setSize: 18, accuracy: 0.9, previous: 0.9, status: "published",
    questions: ["دمای ناحیه‌ی {n} خط ۲ چرا بالا رفته؟", "ضایعات شیفت {n} از حد گذشته؛ علت احتمالی؟", "روند ۲۴ ساعت فشار مذاب خط {n}"],
  },
  {
    id: "ev-doc", agent: "دستیار سند", version: "3.2", model: "خودکار", setSize: 21, accuracy: 0.94, previous: 0.92, status: "published",
    questions: ["بند {n} دستورالعمل QC-SOP-07 چه می‌گوید؟", "فرم شماره‌ی {n} ورود مواد اولیه کجاست؟", "شرایط نگهداری مستربچ طبق سند انبار"],
  },
  {
    id: "ev-pricing", agent: "دستیار فروش و قیمت‌گذاری", version: "1.0", model: "Qwen 32B", setSize: 24, accuracy: 0.85, previous: 0.85, status: "blocked",
    candidate: { version: "1.1", change: "تغییر مدل به DeepSeek", passRate: 0.79, result: 0.79 },
    questions: ["قیمت {n}۰ تن PP-T20 برای مشتری", "حاشیه‌ی سود سفارش {n} با نرخ ارز امروز", "پیش‌فاکتور با اعتبار {n} روز"],
  },
  {
    id: "ev-letters", agent: "نگارنده نامه اداری", version: "1.4", model: "Qwen 32B", setSize: 27, accuracy: 0.91, previous: 0.89, status: "ready",
    questions: ["نامه‌ی پیگیری پرداخت فاکتور {n}", "نامه‌ی معرفی کارشناس به شرکت {n}", "پاسخ رسمی به استعلام شماره‌ی {n}"],
  },
];

export function getEvalRows(): EvalRow[] {
  return rows;
}

/** The same cases every run; the first `round((1 - rate) * size)` spread-out cases fail. */
export function buildCases(row: EvalRow, passRate: number): EvalCase[] {
  const fails = Math.round((1 - passRate) * row.setSize);
  return Array.from({ length: row.setSize }, (_, i) => ({
    id: `${row.id}-${i}`,
    question: row.questions[i % row.questions.length].replace("{n}", (i + 1).toLocaleString("fa-IR")),
    pass: (i * 11) % row.setSize >= fails,
  }));
}
