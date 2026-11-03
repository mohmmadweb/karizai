import type { DataSourceLevel, PolicyModel } from "../types";

const models: PolicyModel[] = [
  { id: "pm-qwen", name: "Qwen 32B", location: "internal", enabled: true, allowed: { public: true, internal: true, confidential: true } },
  { id: "pm-llama", name: "Llama 70B", location: "internal", enabled: true, allowed: { public: true, internal: true, confidential: true } },
  { id: "pm-deepseek", name: "DeepSeek", location: "external", enabled: true, allowed: { public: true, internal: true, confidential: false } },
  { id: "pm-claude", name: "Claude Sonnet", location: "external", enabled: false, allowed: { public: true, internal: false, confidential: false } },
  { id: "pm-gpt", name: "GPT", location: "external", enabled: false, allowed: { public: true, internal: false, confidential: false } },
];

/** Internal model that answers when an external model is cut or not allowed. */
export const fallbackModelId = "pm-qwen";

const sources: DataSourceLevel[] = [
  { id: "ds-lims", name: "نتایج آزمون بچ", system: "LIMS", level: "confidential" },
  { id: "ds-formulas", name: "فرمول‌های کامپاند", system: "LIMS", level: "confidential" },
  { id: "ds-hr", name: "پرونده‌های پرسنلی", system: "منابع انسانی", level: "confidential" },
  { id: "ds-sales", name: "فروش و مشتریان", system: "راهکاران", level: "internal" },
  { id: "ds-inventory", name: "موجودی انبار", system: "SQL Server انبار", level: "internal" },
  { id: "ds-procurement", name: "تدارک و خرید", system: "SQL Server تدارک", level: "internal" },
  { id: "ds-mes", name: "شاخص‌های خط تولید", system: "MES", level: "internal" },
  { id: "ds-cmms", name: "سوابق تعمیرات", system: "CMMS", level: "internal" },
  { id: "ds-qc-docs", name: "دستورالعمل‌های کیفیت (QC-SOP)", system: "دانش سازمانی", level: "internal" },
  { id: "ds-prices", name: "نرخ ارز و مواد اولیه", system: "سامانه‌ی قیمت‌ها", level: "public" },
  { id: "ds-public-docs", name: "اسناد عمومی سازمان", system: "دانش سازمانی", level: "public" },
];

export function getPolicyModels(): PolicyModel[] {
  return models;
}

export function getDataSourceLevels(): DataSourceLevel[] {
  return sources;
}
