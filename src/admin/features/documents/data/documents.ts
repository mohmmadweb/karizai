import { doneSteps, pendingSteps } from "../lib/pipeline";
import type { DocumentRecord, PipelineStep } from "../types";

const KB = 1024;
const MB = 1024 * KB;

const base = {
  sourceId: null,
  confidential: false,
  status: "ready" as const,
  chunkCount: 24,
  steps: doneSteps(),
};

const failed: PipelineStep[] = pendingSteps().map((s, i) =>
  i === 0
    ? { ...s, state: "done" }
    : i === 1
      ? { ...s, state: "error", error: "متن فایل خوانده نشد؛ فایل ممکن است خراب یا رمزدار باشد." }
      : s,
);

const documents: DocumentRecord[] = [
  { ...base, id: "doc-001", name: "سیاست‌های منابع انسانی", fileName: "hr-policy.pdf", extension: "pdf", sizeBytes: 2.4 * MB, language: "fa", chunkCount: 58, createdAt: "2026-10-02T08:30:00.000Z", updatedAt: "2026-10-02T08:34:00.000Z" },
  { ...base, id: "doc-002", name: "Technical Datasheet - HDPE", fileName: "hdpe-datasheet.pdf", extension: "pdf", sizeBytes: 5 * MB, language: "en", sourceId: "fsrc-001", chunkCount: 31, createdAt: "2026-10-10T09:00:00.000Z", updatedAt: "2026-10-10T09:03:00.000Z" },
  { ...base, id: "doc-003", name: "قرارداد تأمین مواد اولیه", fileName: "supply-contract.docx", extension: "docx", sizeBytes: 1.1 * MB, language: "fa", confidential: true, sourceId: "fsrc-001", chunkCount: 42, createdAt: "2026-10-10T09:00:00.000Z", updatedAt: "2026-10-10T09:05:00.000Z" },
  { ...base, id: "doc-004", name: "گزارش فروش مهر", fileName: "sales-mehr.xlsx", extension: "xlsx", sizeBytes: 640 * KB, language: "fa", chunkCount: 12, createdAt: "2026-10-14T11:10:00.000Z", updatedAt: "2026-10-14T11:12:00.000Z" },
  { ...base, id: "doc-005", name: "تصویر اسکن فاکتور", fileName: "invoice-scan.jpg", extension: "jpg", sizeBytes: 3.2 * MB, language: "fa", chunkCount: 3, createdAt: "2026-10-15T07:45:00.000Z", updatedAt: "2026-10-15T07:48:00.000Z" },
  { ...base, id: "doc-006", name: "Quality Manual v3", fileName: "quality-manual-v3.pptx", extension: "pptx", sizeBytes: 12 * MB, language: "en", status: "error", steps: failed, chunkCount: null, createdAt: "2026-10-16T10:20:00.000Z", updatedAt: "2026-10-16T10:21:00.000Z" },
  { ...base, id: "doc-007", name: "دستورالعمل ایمنی کارخانه (Safety)", fileName: "safety-guide.pdf", extension: "pdf", sizeBytes: 8 * MB, language: "mixed", chunkCount: 77, createdAt: "2026-10-17T13:00:00.000Z", updatedAt: "2026-10-17T13:06:00.000Z" },
  { ...base, id: "doc-008", name: "یادداشت جلسه‌ی برنامه‌ریزی تولید", fileName: "meeting-notes.txt", extension: "txt", sizeBytes: 12 * KB, language: "fa", chunkCount: 2, createdAt: "2026-10-18T09:15:00.000Z", updatedAt: "2026-10-18T09:15:00.000Z" },
];

export function getDocuments(): DocumentRecord[] {
  return documents;
}
