import type { AccessSchema } from "../types";

/** Seeded schemas by source id: the production warehouse of Parsa Polymer. */
export const seedAccessSchemas: Record<string, AccessSchema[]> = {
  "source-004": [
    {
      id: "schema-001",
      name: "production",
      description: "اطلاعات تولید: بچ‌ها، خط‌های تولید و ضایعات.",
      tableIds: ["tbl-batches", "tbl-production-lines", "tbl-scrap"],
      confidential: false,
      grants: [
        { subjectType: "group", subjectId: "group-003", rowFilter: "فقط خط‌های ۱ و ۲" },
        { subjectType: "user", subjectId: "user-003", rowFilter: "" },
      ],
    },
    {
      id: "schema-002",
      name: "quality",
      description: "نتایج آزمایش‌های LIMS برای هر بچ.",
      tableIds: ["tbl-lims-results"],
      confidential: false,
      grants: [{ subjectType: "group", subjectId: "group-003", rowFilter: "" }],
    },
    {
      id: "schema-003",
      name: "sales",
      description: "سفارش‌ها و مشتریان.",
      tableIds: ["tbl-sales-orders", "tbl-dw-customers"],
      confidential: false,
      grants: [{ subjectType: "group", subjectId: "group-001", rowFilter: "فقط سفارش‌های سه ماه اخیر" }],
    },
    {
      id: "schema-004",
      name: "finance",
      description: "دفتر کل و فاکتورها؛ محرمانه.",
      tableIds: ["tbl-gl-entries", "tbl-invoices"],
      confidential: true,
      grants: [{ subjectType: "group", subjectId: "group-002", rowFilter: "" }],
    },
  ],
};
