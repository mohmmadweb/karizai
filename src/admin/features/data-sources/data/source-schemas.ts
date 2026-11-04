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

const financeTables: SourceTable[] = [
  { id: "accounts", name: "accounts", columns: [col("id", "id", "integer"), col("code", "code", "varchar(20)"), col("title", "title", "varchar(120)"), col("kind", "kind", "varchar(20)")] },
  { id: "journal_entries", name: "journal_entries", columns: [col("id", "id", "integer"), col("entry_no", "entry_no", "integer"), col("posted_at", "posted_at", "date"), col("memo", "memo", "varchar(200)")] },
  { id: "journal_lines", name: "journal_lines", columns: [col("id", "id", "integer"), col("entry_id", "entry_id", "integer"), col("account_id", "account_id", "integer"), col("debit", "debit", "numeric(16,0)"), col("credit", "credit", "numeric(16,0)")] },
  { id: "cost_centers", name: "cost_centers", columns: [col("id", "id", "integer"), col("code", "code", "varchar(20)"), col("title", "title", "varchar(120)")] },
  { id: "bank_accounts", name: "bank_accounts", columns: [col("id", "id", "integer"), col("bank", "bank", "varchar(60)"), col("iban", "iban", "varchar(34)"), col("balance", "balance", "numeric(18,0)")] },
  { id: "treasury_transactions", name: "treasury_transactions", columns: [col("id", "id", "integer"), col("bank_account_id", "bank_account_id", "integer"), col("amount", "amount", "numeric(18,0)"), col("value_date", "value_date", "date")] },
  { id: "payments", name: "payments", columns: [col("id", "id", "integer"), col("invoice_id", "invoice_id", "integer"), col("amount", "amount", "numeric(16,0)"), col("paid_at", "paid_at", "date")] },
  { id: "invoices", name: "invoices", columns: [col("id", "id", "integer"), col("customer_id", "customer_id", "integer"), col("total", "total", "numeric(16,0)"), col("due_date", "due_date", "date"), col("status", "status", "varchar(20)")] },
  { id: "customers", name: "customers", columns: [col("id", "id", "integer"), col("name", "name", "varchar(120)"), col("credit_limit", "credit_limit", "numeric(16,0)")] },
  { id: "budgets", name: "budgets", columns: [col("id", "id", "integer"), col("fiscal_year", "fiscal_year", "integer"), col("title", "title", "varchar(120)"), col("total", "total", "numeric(18,0)")] },
  { id: "budget_lines", name: "budget_lines", columns: [col("id", "id", "integer"), col("budget_id", "budget_id", "integer"), col("cost_center_id", "cost_center_id", "integer"), col("amount", "amount", "numeric(16,0)")] },
  { id: "employees", name: "employees", columns: [col("id", "id", "integer"), col("full_name", "full_name", "varchar(120)"), col("department", "department", "varchar(60)")] },
  { id: "payroll_runs", name: "payroll_runs", columns: [col("id", "id", "integer"), col("period", "period", "varchar(7)"), col("total", "total", "numeric(18,0)")] },
  { id: "payslips", name: "payslips", columns: [col("id", "id", "integer"), col("run_id", "run_id", "integer"), col("employee_id", "employee_id", "integer"), col("net", "net", "numeric(14,0)")] },
];

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
export function getSourceSchema(sourceId: string, round: number): SourceTable[] {
  if (sourceId === "source-002") return financeTables;
  if (sourceId === "source-004") return productionTables;
  return round >= 1 ? [...baseTables, extraTable] : baseTables;
}
