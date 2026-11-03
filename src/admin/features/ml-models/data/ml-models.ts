export type SchemaField = { name: string; type: "number" | "string" | "date"; label: string; sample: string };

export type MlModel = { id: string; name: string; endpoint: string; ownerUnit: string; framework: string; input: SchemaField[]; output: SchemaField[]; active: boolean };

export function getMlModels(): MlModel[] {
  return [
    {
      id: "ml-shortage", name: "پیش‌بینی کمبود مواد اولیه", endpoint: "https://ml.parsapolymer.local/v1/shortage/predict", ownerUnit: "تدارکات", framework: "XGBoost", active: true,
      input: [
        { name: "material_code", type: "string", label: "کد ماده", sample: "MB-BLK-40" },
        { name: "stock_kg", type: "number", label: "موجودی (کیلوگرم)", sample: "12500" },
        { name: "daily_use_kg", type: "number", label: "مصرف روزانه (کیلوگرم)", sample: "1450" },
        { name: "lead_time_days", type: "number", label: "زمان تأمین (روز)", sample: "10" },
      ],
      output: [
        { name: "days_to_shortage", type: "number", label: "روز تا کمبود", sample: "" },
        { name: "shortage_risk", type: "number", label: "احتمال کمبود", sample: "" },
        { name: "suggested_order_kg", type: "number", label: "مقدار پیشنهادی سفارش", sample: "" },
      ],
    },
    {
      id: "ml-batch", name: "پیش‌بینی کیفیت بچ", endpoint: "https://ml.parsapolymer.local/v1/batch-quality/predict", ownerUnit: "کیفیت", framework: "LightGBM", active: true,
      input: [
        { name: "zone4_temp_c", type: "number", label: "دمای ناحیه ۴ (درجه)", sample: "232" },
        { name: "screw_rpm", type: "number", label: "دور مارپیچ (دور در دقیقه)", sample: "410" },
        { name: "moisture_pct", type: "number", label: "رطوبت مواد (درصد)", sample: "0.18" },
      ],
      output: [
        { name: "mfi_pred", type: "number", label: "MFI پیش‌بینی‌شده", sample: "" },
        { name: "pass_probability", type: "number", label: "احتمال قبولی", sample: "" },
      ],
    },
    {
      id: "ml-order", name: "بهینه‌ساز سفارش", endpoint: "https://ml.parsapolymer.local/v1/order-optimizer/solve", ownerUnit: "تدارکات", framework: "OR-Tools", active: true,
      input: [
        { name: "demand_kg", type: "number", label: "نیاز (کیلوگرم)", sample: "80000" },
        { name: "price_a", type: "number", label: "قیمت تأمین‌کننده الف (تومان/کیلو)", sample: "118000" },
        { name: "price_b", type: "number", label: "قیمت تأمین‌کننده ب (تومان/کیلو)", sample: "121500" },
        { name: "capacity_a_kg", type: "number", label: "ظرفیت الف (کیلوگرم)", sample: "50000" },
      ],
      output: [
        { name: "order_a_kg", type: "number", label: "سفارش از الف", sample: "" },
        { name: "order_b_kg", type: "number", label: "سفارش از ب", sample: "" },
        { name: "total_toman", type: "number", label: "هزینه‌ی کل (تومان)", sample: "" },
      ],
    },
  ];
}

const num = (v: Record<string, string>, k: string) => Number(String(v[k] ?? "").replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))) || 0;

/** Stand-in for calling the endpoint: a simple formula per sample model, so a test returns believable numbers. */
export function runMlModel(id: string, v: Record<string, string>): Record<string, number> {
  if (id === "ml-shortage") {
    const days = num(v, "stock_kg") / Math.max(1, num(v, "daily_use_kg"));
    const lead = num(v, "lead_time_days");
    return { days_to_shortage: Math.round(days * 10) / 10, shortage_risk: Math.round(Math.min(0.99, Math.max(0.02, (lead - days + 6) / 12)) * 100) / 100, suggested_order_kg: Math.max(0, Math.round((lead + 14 - days) * num(v, "daily_use_kg"))) };
  }
  if (id === "ml-batch") {
    const mfi = 10.6 - (num(v, "zone4_temp_c") - 225) * 0.12 - num(v, "moisture_pct") * 3 + (num(v, "screw_rpm") - 400) * 0.004;
    return { mfi_pred: Math.round(mfi * 10) / 10, pass_probability: Math.round(Math.min(0.99, Math.max(0.01, (mfi - 9.2) / 1.6)) * 100) / 100 };
  }
  if (id === "ml-order") {
    const demand = num(v, "demand_kg");
    const cheapA = num(v, "price_a") <= num(v, "price_b");
    const a = cheapA ? Math.min(demand, num(v, "capacity_a_kg")) : 0;
    return { order_a_kg: a, order_b_kg: demand - a, total_toman: a * num(v, "price_a") + (demand - a) * num(v, "price_b") };
  }
  return { result: 1 };
}

export type FineTuneJob = { id: string; name: string; baseModel: string; dataset: string; status: "queued" | "training" | "done"; progress: number; evalScore: number | null; published: boolean };

export function getFineTuneJobs(): FineTuneJob[] {
  return [
    { id: "ft-1", name: "Qwen کیفیت پارسا (فرمولاسیون)", baseModel: "Qwen ۲٫۵ ۷۲B", dataset: "۴٬۲۰۰ پرسش و پاسخ از گزارش‌های کیفیت و LIMS", status: "done", progress: 100, evalScore: 91, published: true },
    { id: "ft-2", name: "دستیار نگهداری خط اکستروژن", baseModel: "Llama ۳٫۱ ۸B", dataset: "۲٬۸۰۰ گزارش تعمیرات CMMS", status: "training", progress: 64, evalScore: null, published: false },
    { id: "ft-3", name: "نگارنده‌ی نامه‌ی اداری پارسا", baseModel: "Qwen ۳ ۳۲B", dataset: "۹۵۰ نامه‌ی رسمی دبیرخانه", status: "queued", progress: 0, evalScore: null, published: false },
  ];
}
