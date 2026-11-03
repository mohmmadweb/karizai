import type { DataSchema } from "../types";

const schemas: DataSchema[] = [
  { id: "schema-001", sourceId: "source-001", name: "فروش", description: "مشتریان و سفارش‌ها.", tableIds: ["tbl-customers", "tbl-orders"] },
  { id: "schema-002", sourceId: "source-001", name: "کاتالوگ", description: "فهرست کالاها و قیمت‌ها.", tableIds: ["tbl-products"] },
  // انبار داده تولید پارسا پلیمر
  { id: "schema-003", sourceId: "source-004", name: "production", description: "اطلاعات تولید: بچ‌ها، خط‌های تولید و ضایعات.", tableIds: ["tbl-batches", "tbl-production-lines", "tbl-scrap"], rowFilter: "فقط خط‌های ۱ و ۲" },
  { id: "schema-004", sourceId: "source-004", name: "quality", description: "نتایج آزمایش‌های LIMS برای هر بچ.", tableIds: ["tbl-lims-results"] },
  { id: "schema-005", sourceId: "source-004", name: "sales", description: "سفارش‌ها و مشتریان.", tableIds: ["tbl-sales-orders", "tbl-dw-customers"], rowFilter: "فقط سفارش‌های سه ماه اخیر" },
  { id: "schema-006", sourceId: "source-004", name: "finance", description: "دفتر کل و فاکتورها.", tableIds: ["tbl-gl-entries", "tbl-invoices"], confidential: true },
];

export function getDataSchemas(): DataSchema[] {
  return schemas;
}
