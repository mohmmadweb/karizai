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

/** Read-only access of one group or user to a schema, optionally narrowed by a row filter. */
export type SchemaGrant = {
  subjectType: "group" | "user";
  subjectId: string;
  /** Free text, e.g. «فقط خط‌های ۱ و ۲»; empty means all rows. */
  rowFilter: string;
};

/** A named subset of a database's tables that access can be granted on. */
export type AccessSchema = {
  id: string;
  name: string;
  description: string;
  tableIds: string[];
  confidential: boolean;
  grants: SchemaGrant[];
};
