import type { OrgAgent } from "../types";

/** Tools that change something in the source system. */
export const writeToolKeys = new Set([
  "conn-1:tool-2", "conn-2:tool-5", "conn-3:tool-7", "conn-5:tool-10", "conn-13:tool-23", "conn-15:tool-26",
  "conn-15:tool-27", "conn-15:tool-28", "conn-19:tool-34", "conn-20:tool-41", "conn-21:tool-44", "conn-22:tool-46", "conn-23:tool-48",
]);

export const internalModelIds = ["pm-qwen", "pm-llama"];

type Meta = Partial<Pick<OrgAgent, "owner" | "unit" | "dataIds" | "writeLimit">>;

/** Owner, unit, data and limits of the Agents that come from the user panel. */
export const agentMeta: Record<string, Meta> = {
  "agent-1": { owner: "مریم احمدی", unit: "فروش", dataIds: ["ds-sales"], writeLimit: { label: "سقف ثبت یادداشت در روز", amount: 50, unit: "یادداشت" } },
  "agent-2": { owner: "مریم احمدی", unit: "کیفیت", dataIds: ["ds-public-docs"] },
  "agent-3": { owner: "مریم احمدی", unit: "منابع انسانی", dataIds: ["ds-hr"] },
  "agent-4": { owner: "واحد مالی", unit: "مالی", dataIds: ["ds-procurement"] },
  "agent-5": { owner: "واحد فروش", unit: "فروش", dataIds: ["ds-sales"] },
  "agent-doc": { owner: "واحد فناوری", unit: "همه‌ی کارکنان", dataIds: ["ds-qc-docs", "ds-public-docs"] },
  "agent-bi": { owner: "واحد فناوری", unit: "همه‌ی کارکنان", dataIds: ["ds-sales", "ds-inventory", "ds-procurement"] },
  "agent-quality": { owner: "مریم احمدی", unit: "کیفیت", dataIds: ["ds-lims", "ds-formulas", "ds-qc-docs"] },
  "agent-maint": { owner: "رضا محمدی", unit: "نگهداری", dataIds: ["ds-cmms"] },
  "agent-pricing": {
    owner: "نرگس حسینی", unit: "فروش", dataIds: ["ds-prices", "ds-inventory", "ds-sales"],
    writeLimit: { label: "سقف مبلغ هر پیش‌فاکتور", amount: 5_000_000_000, unit: "تومان" },
  },
  "agent-indicators": { owner: "علی رضایی", unit: "تولید", dataIds: ["ds-mes"] },
};

/** Organization Agents that are not in the user's list. */
export function getOfficialAgents(): OrgAgent[] {
  return [
    {
      id: "org-letters", name: "نگارنده نامه اداری", purpose: "نامه‌ی رسمی با سربرگ و قالب سازمان؛ آماده‌ی ارجاع در دیدگاه.",
      owner: "مریم احمدی", unit: "همه‌ی کارکنان", origin: "official", status: "pending", sensitive: true,
      tools: [
        { key: "conn-20:tool-41", name: "ساخت سند از قالب", connection: "مایکروسافت ورد (Word)", canWrite: true, mode: "readwrite", enabled: true },
        { key: "didgah:draft", name: "ثبت پیش‌نویس", connection: "دیدگاه", canWrite: true, mode: "readwrite", enabled: true },
      ],
      dataIds: ["ds-public-docs"], modelIds: internalModelIds, writeLimit: { label: "سقف پیش‌نویس در روز", amount: 30, unit: "نامه" },
    },
    {
      id: "org-reorder", name: "دستیار سفارش مواد اولیه", purpose: "موجودی و محموله‌های در راه را می‌خواند و پیش‌نویس سفارش خرید ثبت می‌کند.",
      owner: "سارا کریمی", unit: "تدارک", origin: "official", status: "active", sensitive: false,
      tools: [
        { key: "conn-12:tool-20", name: "اجرای کوئری فقط‌خواندنی", connection: "انبار و موجودی (SQL Server)", canWrite: false, mode: "read", enabled: true },
        { key: "conn-13:tool-23", name: "ثبت پیش‌نویس سفارش خرید", connection: "تدارک و خرید (SQL Server)", canWrite: true, mode: "readwrite", enabled: true },
      ],
      dataIds: ["ds-inventory", "ds-procurement"], modelIds: [...internalModelIds, "pm-deepseek"],
      writeLimit: { label: "سقف مبلغ هر سفارش خرید", amount: 2_000_000_000, unit: "تومان" },
    },
  ];
}
