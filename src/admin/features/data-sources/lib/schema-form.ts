import type { DataSchema, SchemaInput, SchemaTemplate, SourceTable } from "../types";

export type SchemaErrors = { name?: string; tables?: string };

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Name is required and unique inside its connection; at least one table is needed. */
export function validateSchema(input: SchemaInput, siblings: DataSchema[], exceptId?: string): SchemaErrors {
  const errors: SchemaErrors = {};
  if (!input.name.trim()) errors.name = "نام اسکیما را وارد کنید.";
  else if (siblings.some((s) => s.id !== exceptId && same(s.name, input.name))) errors.name = "اسکیمایی با این نام وجود دارد.";
  if (input.tableIds.length === 0) errors.tables = "دست‌کم یک جدول انتخاب کنید.";
  return errors;
}

export const hasSchemaErrors = (errors: SchemaErrors) => Boolean(errors.name || errors.tables);

/** Table ids of a template that exist in the structure. */
export const tableIdsFor = (template: SchemaTemplate, tables: SourceTable[]) =>
  tables.filter((t) => template.tableNames.includes(t.name)).map((t) => t.id);

/** Templates with at least two of their tables in this database (all of them when the template has one). */
export const templatesFor = (templates: SchemaTemplate[], tables: SourceTable[]) =>
  templates.filter((t) => tableIdsFor(t, tables).length >= Math.min(2, t.tableNames.length));
