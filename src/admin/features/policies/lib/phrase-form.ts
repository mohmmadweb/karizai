import type { CustomPhrase } from "@/lib/policies";

/** Message for an empty or repeated phrase, or undefined when it is fine. */
export function validatePhrase(text: string, phrases: CustomPhrase[], exceptId?: string): string | undefined {
  const value = text.trim();
  if (!value) return "عبارت را وارد کنید.";
  if (phrases.some((p) => p.id !== exceptId && p.phrase.trim() === value)) return "این عبارت قبلاً اضافه شده.";
  return undefined;
}
