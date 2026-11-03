import type { FileSource } from "../types";

const sources: FileSource[] = [
  {
    id: "fsrc-001",
    name: "فایل‌سرور فنی",
    protocol: "smb",
    host: "fs-tech.company.local",
    port: 445,
    folderPath: "/Technical/Datasheets",
    username: "readonly_ai",
    hasPassword: true,
    testResult: "success",
    syncIntervalMinutes: 60,
    lastSyncAt: "2026-10-18T09:00:00.000Z",
    lastSyncSummary: { added: 2, changed: 1, removed: 0 },
    createdAt: "2026-10-08T08:00:00.000Z",
  },
  {
    id: "fsrc-002",
    name: "پوشه‌ی مالی",
    protocol: "sftp",
    host: "sftp.finance.local",
    port: 22,
    folderPath: "/exports/finance",
    username: "readonly_ai",
    hasPassword: true,
    testResult: "untested",
    syncIntervalMinutes: 1440,
    lastSyncAt: null,
    lastSyncSummary: null,
    createdAt: "2026-10-12T12:00:00.000Z",
  },
];

export function getFileSources(): FileSource[] {
  return sources;
}
