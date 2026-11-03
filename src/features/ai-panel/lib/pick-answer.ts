import type { AiAnswerKey } from "../types";

/** Key words stand in for real understanding: the same rules as the target design, plus the plant scenario. */
const rules: [RegExp, AiAnswerKey][] = [
  [/(خلاصه امروز|خلاصه‌ی امروز|دستور جلسه|معوق)/, "brief"],
  [/خوانده‌نشده/, "summarizeGroup"],
  [/(مردود|علت|بچ)/, "rca"],
  [/وضعیت/, "status"],
  [/ریسک/, "risk"],
  [/(صورت‌جلسه|تبدیل به وظیفه)/, "tasks"],
  [/(پاسخ پیشنهادی|پیش‌نویس پیام)/, "reply"],
  [/رطوبت/, "moisture"],
  [/(QC-SOP|خلاصه این پوشه|خلاصه‌ی این پوشه)/, "doc"],
  [/(استخراج|فراداده)/, "meta"],
];

export function pickAnswer(question: string): AiAnswerKey {
  return rules.find(([pattern]) => pattern.test(question))?.[1] ?? "generic";
}
