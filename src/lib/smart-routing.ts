/**
 * Smart router (مسیریاب هوشمند): picks a model for a prompt from the models an
 * admin put into a router. The same file lives in the admin panel (for the test
 * box) and in the user panel (for real choices); keep both copies identical.
 */
export type Tier = "light" | "medium" | "heavy";

export const tierLabels: Record<Tier, string> = {
  light: "ساده",
  medium: "متوسط",
  heavy: "پیچیده",
};

export type RouterMember = { modelId: string; tier: Tier };

export type SmartRouter = {
  id: string;
  name: string;
  description: string;
  /** The default router is used by everyone; it cannot be deleted. */
  isDefault: boolean;
  /** Groups that get this router besides the default one. */
  groupIds: string[];
  members: RouterMember[];
};

export type Complexity = { tier: Tier; score: number; reasons: string[] };

const heavyWords = /(تحلیل|مقایسه|استدلال|گام\s*به\s*گام|برنامه‌ریزی|استراتژی|قرارداد|الگوریتم|بهینه|معماری|کد|برنامه‌نویسی|اثبات|ریسک)/;
const mediumWords = /(خلاصه|توضیح بده|بنویس|ترجمه|گزارش|ایمیل|نامه|فهرست|مثال)/;

/** Scores a prompt from 0 to 100 and says why, in plain Persian. */
export function scoreComplexity(prompt: string, options: { hasImage?: boolean; hasFiles?: boolean; historyLength?: number } = {}): Complexity {
  const reasons: string[] = [];
  let score = 0;
  const text = prompt.trim();
  const length = text.length;
  if (length > 600) { score += 40; reasons.push("متن بلند است"); }
  else if (length > 200) { score += 22; reasons.push("متن نسبتاً بلند است"); }
  else if (length > 60) score += 8;
  const heavyCount = text.match(new RegExp(heavyWords.source, "g"))?.length ?? 0;
  if (heavyCount > 0) { score += 45 + Math.min(heavyCount - 1, 2) * 10; reasons.push("نیاز به تحلیل یا استدلال دارد"); }
  else if (mediumWords.test(text)) { score += 18; reasons.push("یک کار نوشتاری معمولی است"); }
  if (/```|function |class |SELECT /i.test(text)) { score += 20; reasons.push("شامل کد است"); }
  if ((text.match(/[؟?]/g) ?? []).length > 1) { score += 8; reasons.push("چند پرسش دارد"); }
  if (options.hasImage) { score += 15; reasons.push("تصویر دارد"); }
  if (options.hasFiles) { score += 10; reasons.push("فایل پیوست دارد"); }
  if ((options.historyLength ?? 0) > 10) { score += 8; reasons.push("گفتگو طولانی شده"); }
  score = Math.min(score, 100);
  if (reasons.length === 0) reasons.push("پرسش کوتاه و ساده است");
  const tier: Tier = score >= 50 ? "heavy" : score >= 20 ? "medium" : "light";
  return { tier, score, reasons };
}

export type RoutableModel = { id: string; name: string; isAvailable: boolean; supportsImages: boolean; supportsTools: boolean };

export type RoutePick =
  | { ok: true; model: RoutableModel; complexity: Complexity; reason: string }
  | { ok: false; complexity: Complexity; reason: string };

const order: Tier[] = ["light", "medium", "heavy"];

/**
 * Chooses a member for the prompt: the wanted tier first, otherwise the
 * closest tier (a stronger one when two are equally close). Members whose model
 * is not usable now, or does not fit the files and tools, are skipped.
 */
export function pickModel(
  router: Pick<SmartRouter, "name" | "members">,
  models: RoutableModel[],
  prompt: string,
  needs: { images?: boolean; tools?: boolean; hasFiles?: boolean; historyLength?: number } = {},
): RoutePick {
  const complexity = scoreComplexity(prompt, { hasImage: needs.images, hasFiles: needs.hasFiles, historyLength: needs.historyLength });
  const usable = router.members
    .map((member) => ({ member, model: models.find((m) => m.id === member.modelId) }))
    .filter((item): item is { member: RouterMember; model: RoutableModel } =>
      Boolean(item.model && item.model.isAvailable && (!needs.images || item.model.supportsImages) && (!needs.tools || item.model.supportsTools)),
    );
  if (usable.length === 0) return { ok: false, complexity, reason: `هیچ مدل قابل‌استفاده‌ای در مسیریاب «${router.name}» نیست.` };
  const distance = (tier: Tier) => Math.abs(order.indexOf(tier) - order.indexOf(complexity.tier));
  const best = [...usable].sort(
    (a, b) => distance(a.member.tier) - distance(b.member.tier) || order.indexOf(b.member.tier) - order.indexOf(a.member.tier),
  )[0];
  const exact = best.member.tier === complexity.tier;
  const reason = `مسیریاب هوشمند «${router.name}»: درخواست «${tierLabels[complexity.tier]}» تشخیص داده شد (${complexity.reasons.join("، ")}) و ${exact ? "" : "چون مدلی برای این سطح نبود، نزدیک‌ترین سطح یعنی «" + tierLabels[best.member.tier] + "» استفاده شد: "}«${best.model.name}» پاسخ داد.`;
  return { ok: true, model: best.model, complexity, reason };
}
