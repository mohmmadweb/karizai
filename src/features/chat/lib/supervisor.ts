export type SupervisionOutcome = "approved" | "corrected" | "rerun";

export const approvedDecision: SupervisionDecision = {
  outcome: "approved",
  lines: ["درستی و کیفیت پاسخ سنجیده می‌شود", "مشکلی پیدا نشد"],
  result: "تأیید شد.",
};

export type SupervisionDecision = {
  outcome: SupervisionOutcome;
  /** Short progress lines shown while the supervisor works. */
  lines: string[];
  result: string;
};

/**
 * Canned verdicts that stand in for a real supervising agent. An answer made by
 * several agents gets one correction, an analytic prompt is re-run with a
 * stronger model, and anything else is approved.
 */
export function decideSupervision(question: string, orchestrated: boolean): SupervisionDecision {
  if (orchestrated) {
    return {
      outcome: "corrected",
      lines: ["پیش‌نویس پاسخ با داده‌ها تطبیق داده می‌شود", "یک ناهماهنگی عددی پیدا شد", "عدد اصلاح شد"],
      result: "یک بار اصلاح شد: سهم تهران از ۳۸٪ به ۳۶٪ درست شد، چون با جدول فروش هم‌خوان نبود.",
    };
  }
  if (/(تحلیل|مقایسه|استدلال)/.test(question)) {
    return {
      outcome: "rerun",
      lines: ["درستی و کیفیت پاسخ سنجیده می‌شود", "عمق تحلیل کافی نبود", "کار برای مدل قوی‌تر فرستاده شد"],
      result: "با مدل قوی‌تر دوباره اجرا شد.",
    };
  }
  return approvedDecision;
}
