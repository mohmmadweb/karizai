import type { DocLanguage } from "../types";

/** Stand-in for real language detection: looks at the letters of the file name. */
export function detectLanguage(name: string): DocLanguage {
  const persian = /[؀-ۿ]/.test(name);
  const latin = /[A-Za-z]/.test(name.replace(/\.[^.]+$/, ""));
  if (persian && latin) return "mixed";
  return persian ? "fa" : "en";
}

export const languageLabel: Record<DocLanguage, string> = {
  fa: "فارسی",
  en: "انگلیسی",
  mixed: "ترکیبی",
};
