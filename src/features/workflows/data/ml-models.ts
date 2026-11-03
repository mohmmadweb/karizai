import type { ToolOutput } from "@/features/connections/types";

/** A machine-learning model the organization registered (endpoint, inputs, numeric outputs). */
export type MlModel = {
  id: string;
  name: string;
  description: string;
  framework: string;
  endpoint: string;
  inputs: string[];
  outputs: ToolOutput[];
  /** What the sample run returns for each output; a condition compares these. */
  sample: Record<string, number>;
};

const models: MlModel[] = [
  {
    id: "ml-shortage", name: "پیش‌بینی کمبود مواد", description: "از موجودی، مصرف روزانه و محموله‌های در راه، روزهای مانده تا کمبود را پیش‌بینی می‌کند.",
    framework: "XGBoost · نسخه ۳", endpoint: "http://ml.parsapolymer.local/models/shortage/v3/predict",
    inputs: ["موجودی (تن)", "مصرف روزانه (تن)", "محموله‌های در راه"],
    outputs: [{ key: "daysToShortage", label: "روز تا کمبود", unit: "روز" }, { key: "probability", label: "احتمال کمبود", unit: "٪" }],
    sample: { daysToShortage: 3.2, probability: 87 },
  },
  {
    id: "ml-order", name: "بهینه‌ساز سفارش", description: "مقدار اقتصادی سفارش را با قیمت، زمان تحویل و ظرفیت انبار حساب می‌کند.",
    framework: "بهینه‌سازی خطی (OR-Tools)", endpoint: "http://ml.parsapolymer.local/models/order-optimizer/v2/solve",
    inputs: ["قیمت‌های استعلام", "زمان تحویل", "ظرفیت انبار"],
    outputs: [{ key: "quantityTon", label: "مقدار بهینه", unit: "تن" }, { key: "savingPercent", label: "صرفه‌جویی", unit: "٪" }],
    sample: { quantityTon: 80, savingPercent: 6.4 },
  },
  {
    id: "ml-schedule", name: "بهینه‌ساز زمان‌بندی خطوط", description: "سفارش‌ها را روی خطوط اکسترودر می‌چیند تا تعویض فرمول و رنگ کمترین باشد.",
    framework: "برنامه‌ریزی محدودیت (CP-SAT)", endpoint: "http://ml.parsapolymer.local/models/line-scheduler/v1/solve",
    inputs: ["سفارش‌های باز", "ظرفیت خطوط", "توقف‌های برنامه‌ریزی‌شده"],
    outputs: [{ key: "changeovers", label: "تعداد تعویض فرمول" }, { key: "utilization", label: "بهره‌وری خطوط", unit: "٪" }, { key: "lateOrders", label: "سفارش‌های دیرکرد" }],
    sample: { changeovers: 4, utilization: 91, lateOrders: 1 },
  },
  {
    id: "ml-scrap", name: "پیش‌بینی ضایعات خط", description: "درصد ضایعات شیفت بعد را از دما، فشار و رطوبت مواد پیش‌بینی می‌کند.",
    framework: "LightGBM · نسخه ۲", endpoint: "http://ml.parsapolymer.local/models/scrap/v2/predict",
    inputs: ["دمای نواحی", "فشار مذاب", "رطوبت مواد"],
    outputs: [{ key: "scrapPercent", label: "ضایعات پیش‌بینی‌شده", unit: "٪" }],
    sample: { scrapPercent: 2.6 },
  },
];

export function getMlModels(): MlModel[] {
  return models;
}

export function getMlModel(id: string | undefined): MlModel | undefined {
  return models.find((item) => item.id === id);
}

export const sampleCode: Record<"python" | "javascript", string> = {
  python: `# ورودی: خروجی گام قبل در متغیر data
results = data["batches"]
cpk = min((r["usl"] - r["mean"]) / (3 * r["std"]) for r in results)
output = {"cpk": round(cpk, 2), "batches": len(results)}`,
  javascript: `// ورودی: خروجی گام قبل در متغیر data
const late = data.orders.filter((o) => o.dueDays < o.leadDays);
return { lateOrders: late.length, ids: late.map((o) => o.id) };`,
};

/** Default rules of a supervisor step. */
export const defaultChecks = ["هر ادعا به منبع ارجاع داشته باشد", "داده‌ی حساس از سازمان بیرون نرود", "خروجی با رویه‌ی QC-SOP-07 سازگار باشد"];
