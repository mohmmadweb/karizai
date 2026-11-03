export type LimitKey = "rpm" | "rpd" | "tpm" | "concurrent";

export type Limits = Record<LimitKey, number>;

export const limitLabels: Record<LimitKey, string> = {
  rpm: "درخواست در دقیقه (RPM)",
  rpd: "درخواست در روز (RPD)",
  tpm: "توکن در دقیقه (TPM)",
  concurrent: "هم‌زمان",
};

export const shortLabels: Record<LimitKey, string> = { rpm: "RPM", rpd: "RPD", tpm: "TPM", concurrent: "هم‌زمان" };

export const limitKeys = Object.keys(limitLabels) as LimitKey[];

/** Starting limits; internal servers allow more requests but fewer parallel ones per GPU. */
export function defaultLimits(kind: "provider" | "model", selfHosted: boolean): Limits {
  if (kind === "provider") return selfHosted ? { rpm: 600, rpd: 120_000, tpm: 400_000, concurrent: 32 } : { rpm: 500, rpd: 50_000, tpm: 800_000, concurrent: 50 };
  return selfHosted ? { rpm: 240, rpd: 60_000, tpm: 160_000, concurrent: 12 } : { rpm: 120, rpd: 10_000, tpm: 300_000, concurrent: 20 };
}

/** Share of each limit used at the start of the sample (0 to 1), by row position, so rows differ. */
export function startingLoad(index: number): Limits {
  const base = [0.62, 0.41, 0.78, 0.33, 0.55, 0.25, 0.7, 0.48][index % 8];
  return { rpm: base, rpd: Math.min(0.9, base * 0.8 + 0.1), tpm: Math.min(0.95, base + 0.08), concurrent: Math.max(0.1, base - 0.15) };
}

export type ThrottleEvent = { id: string; at: string; target: string; limit: LimitKey; action: string };

export function getSampleEvents(): ThrottleEvent[] {
  return [
    { id: "ev-3", at: "۰۹:۴۲", target: "GPT-4o", limit: "tpm", action: "۱۲ درخواست ۸ ثانیه در صف ماند" },
    { id: "ev-2", at: "۰۹:۱۵", target: "OpenRouter", limit: "rpm", action: "پاسخ ۴۲۹؛ ۳ درخواست به Qwen داخلی رفت" },
    { id: "ev-1", at: "دیروز ۱۶:۰۳", target: "Qwen ۲٫۵", limit: "concurrent", action: "۵ درخواست تا آزاد شدن GPU منتظر ماند" },
  ];
}
