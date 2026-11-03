import type { FileSource, Protocol, SourceInput } from "../types";
import { defaultPort } from "./selectors";
import {
  normalizePort,
  validateFolderPath,
  validateHost,
  validatePassword,
  validatePort,
  validateSourceName,
  validateUsername,
} from "./validation";

export type SourceFormValues = {
  name: string;
  protocol: Protocol;
  host: string;
  port: string;
  folderPath: string;
  username: string;
  password: string;
};

export type SourceFormErrors = Partial<Record<keyof SourceFormValues, string>>;

export const emptyForm: SourceFormValues = {
  name: "",
  protocol: "smb",
  host: "",
  port: String(defaultPort.smb),
  folderPath: "",
  username: "",
  password: "",
};

export const formFromSource = (s: FileSource): SourceFormValues => ({
  name: s.name,
  protocol: s.protocol,
  host: s.host,
  port: String(s.port),
  folderPath: s.folderPath,
  username: s.username,
  password: "",
});

export function validateField(key: keyof SourceFormValues, v: SourceFormValues, passwordRequired: boolean) {
  switch (key) {
    case "name": return validateSourceName(v.name);
    case "host": return validateHost(v.host);
    case "port": return validatePort(v.port);
    case "folderPath": return validateFolderPath(v.folderPath);
    case "username": return validateUsername(v.username);
    case "password": return passwordRequired ? validatePassword(v.password) : undefined;
    default: return undefined;
  }
}

export function validateForm(v: SourceFormValues, passwordRequired: boolean): SourceFormErrors {
  const keys: (keyof SourceFormValues)[] = ["name", "host", "port", "folderPath", "username", "password"];
  return Object.fromEntries(keys.map((k) => [k, validateField(k, v, passwordRequired)]));
}

export const hasErrors = (e: SourceFormErrors) => Object.values(e).some(Boolean);

export const toInput = (v: SourceFormValues): SourceInput => ({
  name: v.name,
  protocol: v.protocol,
  host: v.host,
  port: Number(normalizePort(v.port)),
  folderPath: v.folderPath,
  username: v.username,
  password: v.password,
});
