import type { SchemaDescriptions } from "../types";

const descriptions: SchemaDescriptions = {
  "source-001": {
    "tbl-customers": "فهرست مشتریان سازمان.",
    "tbl-customers:province": "استان محل سکونت مشتری.",
    "tbl-orders": "سفارش‌های ثبت‌شده‌ی مشتریان.",
    "tbl-orders:total": "مبلغ کل سفارش به ریال.",
  },
};

export function getSchemaDescriptions(): SchemaDescriptions {
  return descriptions;
}
