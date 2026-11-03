import type { DataSource } from "../types";

const sources: DataSource[] = [
  {
    id: "source-001",
    name: "پایگاه فروش",
    type: "postgresql",
    host: "10.0.0.21",
    port: 5432,
    database: "sales_db",
    username: "readonly_ai",
    hasPassword: true,
    testResult: "success",
    active: true,
    createdAt: "2026-09-28T09:00:00.000Z",
  },
  {
    id: "source-002",
    name: "پایگاه مالی",
    type: "sqlserver",
    host: "fin-db.company.local",
    port: 1433,
    database: "finance",
    username: "readonly_ai",
    hasPassword: true,
    testResult: "untested",
    active: false,
    createdAt: "2026-10-04T10:30:00.000Z",
  },
  {
    id: "source-003",
    name: "پایگاه انبار",
    type: "mysql",
    host: "error.warehouse.local",
    port: 3306,
    database: "warehouse",
    username: "readonly_ai",
    hasPassword: true,
    testResult: "failed",
    active: false,
    createdAt: "2026-10-08T14:00:00.000Z",
  },
];

export function getDataSources(): DataSource[] {
  return sources;
}
