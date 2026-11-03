export type DatabaseType = "sqlserver" | "postgresql" | "mysql";

export type TestResult = "untested" | "success" | "failed";

/** The password is never part of a record; only whether one exists. */
export type DataSource = {
  id: string;
  name: string;
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  /** Should be a read-only account. */
  username: string;
  hasPassword: boolean;
  testResult: TestResult;
  /** True only while `testResult` is «success». */
  active: boolean;
  /** ISO date string. */
  createdAt: string;
};

export type SourceColumn = { id: string; name: string; dataType: string };

export type SourceTable = { id: string; name: string; columns: SourceColumn[] };

/** Persian descriptions by source id, then by table id or `tableId:columnId`. */
export type SchemaDescriptions = Record<string, Record<string, string>>;

export type SourceInput = {
  name: string;
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  /** Discarded after use. On edit, empty keeps the current password. */
  password: string;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

export type AddSourceResult = { ok: true; id: string } | { ok: false; error: string };

/** A named set of tables of one connection. Access can be given to the set instead of the whole database. */
export type DataSchema = {
  id: string;
  sourceId: string;
  name: string;
  description: string;
  /** Ids of `SourceTable`; an id that is no longer in the structure is shown as missing. */
  tableIds: string[];
  /** Free text narrowing the rows, such as «فقط خط‌های ۱ و ۲»; empty means all rows. */
  rowFilter?: string;
  /** Confidential data: only internal models may read it. */
  confidential?: boolean;
};

export type SchemaInput = { name: string; description: string; tableIds: string[]; rowFilter?: string; confidential?: boolean };
