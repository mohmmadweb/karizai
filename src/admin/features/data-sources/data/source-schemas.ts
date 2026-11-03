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

/**
 * Stand-in for reading the tables of a database; nothing is read. From the
 * second round on, one extra table appears so fetching again can be tried.
 */
export function getSourceSchema(round: number): SourceTable[] {
  return round >= 1 ? [...baseTables, extraTable] : baseTables;
}
