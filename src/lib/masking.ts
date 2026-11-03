/**
 * Hides sensitive values in a message before it goes to a model, and puts the
 * originals back into the answer. The admin test box and the user panel chat
 * use this one file; the copies in both apps must stay identical.
 */
import type { MaskField, Policies } from "./policies";

export type MaskMap = { token: string; value: string }[];

const D = "[0-9۰-۹]";
const NUMBER = `${D}[0-9۰-۹٬,.٫]*(?:\\s*(?:میلیارد|میلیون|هزار|تومان|ریال|درصد|٪))*`;

const fieldPatterns: Record<MaskField, { name: string; regex: RegExp }> = {
  iban: { name: "شبا", regex: new RegExp(`(?<![A-Za-z0-9])IR${D}{24}(?!${D})`, "gi") },
  card: { name: "کارت", regex: new RegExp(`(?<!${D})(?:${D}[ -]?){15}${D}(?!${D})`, "g") },
  mobile: { name: "موبایل", regex: new RegExp(`(?<!${D})(?:09|۰۹)${D}{9}(?!${D})`, "g") },
  nationalId: { name: "کد-ملی", regex: new RegExp(`(?<!${D})${D}{10}(?!${D})`, "g") },
  email: { name: "ایمیل", regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
};

const order: MaskField[] = ["iban", "card", "mobile", "nationalId", "email"];

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const toPersian = (n: number) => String(n).replace(/\d/g, (d) => persianDigits[Number(d)]);
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type Found = { start: number; end: number; name: string };

/** Finds every value to hide; where matches overlap, the earlier and longer one wins. */
function findAll(text: string, masking: Policies["masking"]): Found[] {
  const found: Found[] = [];
  for (const phrase of masking.phrases) {
    if (!phrase.phrase.trim()) continue;
    const body = escape(phrase.phrase.trim());
    const regex = new RegExp(phrase.withNumber ? `${body}(?:\\s*[:：=]?\\s*${NUMBER})?` : body, "g");
    for (const m of text.matchAll(regex)) found.push({ start: m.index!, end: m.index! + m[0].length, name: phrase.phrase.trim().replace(/\s+/g, "-") });
  }
  for (const field of order) {
    if (!masking.fields[field]) continue;
    const { name, regex } = fieldPatterns[field];
    for (const m of text.matchAll(new RegExp(regex.source, regex.flags))) found.push({ start: m.index!, end: m.index! + m[0].length, name });
  }
  found.sort((a, b) => a.start - b.start || b.end - a.end);
  const kept: Found[] = [];
  for (const item of found) if (kept.length === 0 || item.start >= kept[kept.length - 1].end) kept.push(item);
  return kept;
}

export function maskWithPolicy(text: string, masking: Policies["masking"]): { masked: string; map: MaskMap; count: number } {
  const matches = findAll(text, masking);
  const counters: Record<string, number> = {};
  const map: MaskMap = [];
  let masked = "";
  let cursor = 0;
  for (const item of matches) {
    counters[item.name] = (counters[item.name] ?? 0) + 1;
    const token = `[${item.name}-${toPersian(counters[item.name])}]`;
    map.push({ token, value: text.slice(item.start, item.end) });
    masked += text.slice(cursor, item.start) + token;
    cursor = item.end;
  }
  return { masked: masked + text.slice(cursor), map, count: map.length };
}

/** Puts the original values back into the model's answer for the user. */
export function restoreText(text: string, map: MaskMap): string {
  return map.reduce((result, item) => result.split(item.token).join(item.value), text);
}
