import type { SourceTable } from "../types";

const col = (id: string, name: string, dataType: string) => ({ id, name, dataType });

const baseTables: SourceTable[] = [
  {
    id: "tbl-customers",
    name: "customers",
    columns: [col("id", "id", "integer"), col("name", "name", "varchar(120)"), col("province", "province", "varchar(60)"), col("created_at", "created_at", "timestamp")],
  },
  {
    id: "tbl-orders",
    name: "orders",
    columns: [col("id", "id", "integer"), col("customer_id", "customer_id", "integer"), col("total", "total", "numeric(14,0)"), col("status", "status", "varchar(20)"), col("ordered_at", "ordered_at", "timestamp")],
  },
  {
    id: "tbl-products",
    name: "products",
    columns: [col("id", "id", "integer"), col("title", "title", "varchar(200)"), col("price", "price", "numeric(12,0)")],
  },
];

const extraTable: SourceTable = {
  id: "tbl-returns",
  name: "returns",
  columns: [col("id", "id", "integer"), col("order_id", "order_id", "integer"), col("reason", "reason", "varchar(200)")],
};

const productionTables: SourceTable[] = [
  { id: "tbl-batches", name: "batches", columns: [col("id", "id", "int"), col("grade", "grade", "nvarchar(40)"), col("line_id", "line_id", "int"), col("status", "status", "nvarchar(20)"), col("produced_at", "produced_at", "datetime2")] },
  { id: "tbl-production-lines", name: "production_lines", columns: [col("id", "id", "int"), col("name", "name", "nvarchar(60)"), col("capacity_kg_h", "capacity_kg_h", "int")] },
  { id: "tbl-scrap", name: "scrap_records", columns: [col("id", "id", "int"), col("batch_id", "batch_id", "int"), col("weight_kg", "weight_kg", "decimal(10,2)"), col("reason", "reason", "nvarchar(200)")] },
  { id: "tbl-lims-results", name: "lims_results", columns: [col("id", "id", "int"), col("batch_id", "batch_id", "int"), col("test", "test", "nvarchar(60)"), col("value", "value", "decimal(12,4)"), col("passed", "passed", "bit")] },
  { id: "tbl-sales-orders", name: "sales_orders", columns: [col("id", "id", "int"), col("customer_id", "customer_id", "int"), col("grade", "grade", "nvarchar(40)"), col("quantity_kg", "quantity_kg", "int"), col("ordered_at", "ordered_at", "datetime2")] },
  { id: "tbl-dw-customers", name: "customers", columns: [col("id", "id", "int"), col("name", "name", "nvarchar(120)"), col("province", "province", "nvarchar(60)")] },
  { id: "tbl-gl-entries", name: "gl_entries", columns: [col("id", "id", "int"), col("account", "account", "nvarchar(40)"), col("amount", "amount", "decimal(16,0)"), col("posted_at", "posted_at", "datetime2")] },
  { id: "tbl-invoices", name: "invoices", columns: [col("id", "id", "int"), col("order_id", "order_id", "int"), col("total", "total", "decimal(16,0)"), col("paid", "paid", "bit")] },
];

/**
 * Stand-in for reading the tables of a database; nothing is read. From the
 * second round on, one extra table appears so fetching again can be tried.
 */
export function getSourceSchema(round: number, sourceId?: string): SourceTable[] {
  if (sourceId === "source-004") return productionTables;
  return round >= 1 ? [...baseTables, extraTable] : baseTables;
}
