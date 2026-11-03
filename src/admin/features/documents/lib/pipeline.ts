import type { DocStatus, PipelineStep, StepKey } from "../types";

export const stepKeys: StepKey[] = ["receive", "extract", "chunk", "embed", "index"];

const imageExtensions = ["png", "jpg", "jpeg", "tif", "tiff"];

export const isImage = (extension: string) => imageExtensions.includes(extension);

/** Extraction is done with OCR for images; the label says so. */
export function stepLabel(key: StepKey, extension: string): string {
  switch (key) {
    case "receive": return "دریافت سند";
    case "extract": return isImage(extension) ? "استخراج متن با OCR" : "استخراج متن";
    case "chunk": return "تکه‌تکه‌کردن";
    case "embed": return "بردارسازی";
    case "index": return "نمایه‌سازی";
  }
}

export const stepStateLabel = {
  pending: "در انتظار",
  running: "در حال انجام",
  done: "انجام‌شده",
  error: "خطا",
} as const;

export const pendingSteps = (): PipelineStep[] => stepKeys.map((key) => ({ key, state: "pending" }));

export const doneSteps = (): PipelineStep[] => stepKeys.map((key) => ({ key, state: "done" }));

/** The status always follows the steps, so the two cannot disagree. */
export function statusOf(steps: PipelineStep[]): DocStatus {
  if (steps.some((s) => s.state === "error")) return "error";
  if (steps.every((s) => s.state === "done")) return "ready";
  if (steps.some((s) => s.state === "running" || s.state === "done")) return "processing";
  return "queued";
}

export const statusLabel: Record<DocStatus, string> = {
  queued: "در صف",
  processing: "در حال پردازش",
  ready: "آماده",
  error: "خطا",
};
