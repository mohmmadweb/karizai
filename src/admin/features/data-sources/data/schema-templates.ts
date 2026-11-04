import type { SchemaTemplate } from "../types";

/** Ready-made schemas; the dialog offers those that have at least one of their tables in the database. */
export function getSchemaTemplates(): SchemaTemplate[] {
  return [
    { id: "tpl-accounting", name: "حسابداری", description: "حساب‌ها، سندهای حسابداری و مرکزهای هزینه.", tableNames: ["accounts", "journal_entries", "journal_lines", "cost_centers"] },
    { id: "tpl-treasury", name: "خزانه‌داری", description: "حساب‌های بانکی، تراکنش‌های خزانه و پرداخت‌ها.", tableNames: ["bank_accounts", "treasury_transactions", "payments"] },
    { id: "tpl-budget", name: "بودجه", description: "بودجه‌های سالانه و ردیف‌های بودجه به تفکیک مرکز هزینه.", tableNames: ["budgets", "budget_lines", "cost_centers"] },
    { id: "tpl-payroll", name: "حقوق و دستمزد", description: "کارکنان، دوره‌های پرداخت و فیش‌های حقوقی.", tableNames: ["employees", "payroll_runs", "payslips"] },
    { id: "tpl-receivables", name: "فروش و دریافتنی‌ها", description: "فاکتورها، مشتریان و دریافت‌ها.", tableNames: ["invoices", "customers", "payments"] },
    { id: "tpl-sales", name: "فروش", description: "مشتریان و سفارش‌ها.", tableNames: ["customers", "orders"] },
    { id: "tpl-production", name: "تولید", description: "بچ‌ها، خطوط تولید و ضایعات.", tableNames: ["batches", "production_lines", "scrap_records"] },
    { id: "tpl-quality", name: "کیفیت (آزمایشگاه)", description: "نتایج آزمایش‌های LIMS و بچ‌های مربوط به آن‌ها.", tableNames: ["lims_results", "batches"] },
    { id: "tpl-catalog", name: "کاتالوگ", description: "فهرست کالاها و قیمت‌ها.", tableNames: ["products"] },
  ];
}
