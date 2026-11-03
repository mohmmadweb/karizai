import type { DatabaseType } from "../types";

export const databaseTypes: { value: DatabaseType; label: string; defaultPort: number }[] = [
  { value: "sqlserver", label: "SQL Server", defaultPort: 1433 },
  { value: "postgresql", label: "PostgreSQL", defaultPort: 5432 },
  { value: "mysql", label: "MySQL", defaultPort: 3306 },
];

export const databaseTypeLabel = (type: DatabaseType) =>
  databaseTypes.find((t) => t.value === type)?.label ?? type;
