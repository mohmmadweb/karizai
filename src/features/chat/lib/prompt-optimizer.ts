import type { PromptOptimization, TimelineStep } from "../types";

/** Rough token count of Persian text; good enough to compare before and after. */
export const countTokens = (text: string) => Math.max(1, Math.round(text.length / 2.2));

/** Instructions of the assistant that go with every request, before and after compression. */
const systemTokens = { before: 420, after: 160 };

const fillers: RegExp[] = [/^\s*سلام[،,!.]?\s*/, /(لطفاً|لطفا|خواهشمندم|خواهش می‌کنم)\s*/g, /(می‌خواستم بدانم|می‌خواهم بدانم|ممکن است|اگر امکان دارد|اگر می‌شود)\s*(که\s*)?/g, /\s*(با تشکر|ممنون|متشکرم)[.!]?\s*$/g, /\s{2,}/g];

/**
 * «✦ بهینه‌ساز پرامپت»: drops polite filler, and the earlier messages are sent as a short summary.
 * Simulated: the numbers come from text length, not a real tokenizer.
 */
export function optimizePrompt(text: string, history: string[]): PromptOptimization {
  const compressedQuestion = fillers.reduce((result, pattern) => result.replace(pattern, " "), text).trim() || text;
  const historyTokens = history.reduce((sum, item) => sum + countTokens(item), 0);
  const summary = history.length ? `[خلاصه‌ی ${history.length.toLocaleString("fa-IR")} پیام قبلی]\n` : "";
  return {
    original: text,
    compressed: `${summary}${compressedQuestion}`,
    before: systemTokens.before + historyTokens + countTokens(text),
    after: systemTokens.after + Math.round(historyTokens * 0.35) + countTokens(compressedQuestion),
  };
}

export const savedPercent = (item: PromptOptimization) => Math.max(0, Math.round((1 - item.after / Math.max(item.before, 1)) * 100));

/** The first step of the timeline when the optimizer is on. */
export function optimizerStep(item: PromptOptimization, status: TimelineStep["status"]): TimelineStep {
  const percent = savedPercent(item).toLocaleString("fa-IR");
  return {
    id: "optimizer",
    kind: "optimizer",
    title: "✦ بهینه‌ساز پرامپت",
    status,
    lines: ["عبارت‌های اضافه حذف شد", "پیام‌های قبلی خلاصه شد"],
    result: status === "done" ? `توکن قبل ${item.before.toLocaleString("fa-IR")} / بعد ${item.after.toLocaleString("fa-IR")} · ${percent}٪ صرفه‌جویی` : undefined,
  };
}
