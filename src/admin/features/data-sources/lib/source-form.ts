import type { DataSource, SourceInput, DatabaseType } from "../types";
import { databaseTypes } from "./database-types";
import {
  normalizePort,
  validateDatabaseName,
  validateHost,
  validatePassword,
  validatePort,
  validateSourceName,
  validateUsername,
} from "./validation";

export type SourceFormValues = {
  name: string;
  type: DatabaseType;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
};

export type SourceFormErrors = Partial<Record<keyof SourceFormValues, string>>;

export const emptyForm: SourceFormValues = {
  name: "",
  type: "postgresql",
  host: "",
  port: String(databaseTypes[1].defaultPort),
  database: "",
  username: "",
  password: "",
};

export const formFromSource = (s: DataSource): SourceFormValues => ({
  name: s.name,
  type: s.type,
  host: s.host,
  port: String(s.port),
  database: s.database,
  username: s.username,
  password: "",
});

export function validateField(
  key: keyof SourceFormValues,
  values: SourceFormValues,
  passwordRequired: boolean,
): string | undefined {
  switch (key) {
    case "name": return validateSourceName(values.name);
    case "host": return validateHost(values.host);
    case "port": return validatePort(values.port);
    case "database": return validateDatabaseName(values.database);
    case "username": return validateUsername(values.username);
    case "password": return passwordRequired ? validatePassword(values.password) : undefined;
    default: return undefined;
  }
}

export function validateForm(values: SourceFormValues, passwordRequired: boolean): SourceFormErrors {
  const keys: (keyof SourceFormValues)[] = ["name", "host", "port", "database", "username", "password"];
  return Object.fromEntries(keys.map((k) => [k, validateField(k, values, passwordRequired)]));
}

export const hasErrors = (errors: SourceFormErrors) => Object.values(errors).some(Boolean);

export const toInput = (v: SourceFormValues): SourceInput => ({
  name: v.name,
  type: v.type,
  host: v.host,
  port: Number(normalizePort(v.port)),
  database: v.database,
  username: v.username,
  password: v.password,
});
