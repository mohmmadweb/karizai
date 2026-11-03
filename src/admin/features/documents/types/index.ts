export type DocStatus = "queued" | "processing" | "ready" | "error";

export type StepKey = "receive" | "extract" | "chunk" | "embed" | "index";

export type StepState = "pending" | "running" | "done" | "error";

export type PipelineStep = { key: StepKey; state: StepState; error?: string };

export type DocLanguage = "fa" | "en" | "mixed";

export type DocumentRecord = {
  id: string;
  /** Display name, editable. */
  name: string;
  /** Name of the original file, read-only. */
  fileName: string;
  /** Lower case, without the dot. */
  extension: string;
  sizeBytes: number;
  language: DocLanguage;
  /** Id of the file-server source; null when uploaded by hand. */
  sourceId: string | null;
  status: DocStatus;
  steps: PipelineStep[];
  chunkCount: number | null;
  confidential: boolean;
  /** ISO date strings. */
  createdAt: string;
  updatedAt: string;
};

export type Protocol = "smb" | "ftp" | "sftp" | "seafile";

export type SyncInterval = 15 | 60 | 360 | 1440;

export type TestResult = "untested" | "success" | "failed";

export type SyncSummary = { added: number; changed: number; removed: number };

/** The password is never part of a record; only whether one exists. */
export type FileSource = {
  id: string;
  name: string;
  protocol: Protocol;
  host: string;
  port: number;
  folderPath: string;
  username: string;
  hasPassword: boolean;
  testResult: TestResult;
  syncIntervalMinutes: SyncInterval;
  /** ISO date string, or null before the first sync. */
  lastSyncAt: string | null;
  lastSyncSummary: SyncSummary | null;
  createdAt: string;
};

export type SourceInput = {
  name: string;
  protocol: Protocol;
  host: string;
  port: number;
  folderPath: string;
  username: string;
  /** Discarded after use. On edit, empty keeps the current password. */
  password: string;
};

export type DocumentInfoInput = { name: string; language: DocLanguage; confidential: boolean };

export type ActionResult = { ok: true } | { ok: false; error: string };

export type AddSourceResult = { ok: true; id: string } | { ok: false; error: string };

export type PickedFile = { name: string; sizeBytes: number };
