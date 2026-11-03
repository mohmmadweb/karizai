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

/** How much each criterion counts when the router compares candidate models (0 to 100 each). */
export type RouterWeights = { quality: number; speed: number; cost: number };

export const weightLabels: Record<keyof RouterWeights, string> = {
  quality: "کیفیت",
  speed: "سرعت",
  cost: "هزینه",
};

export const defaultWeights: RouterWeights = { quality: 50, speed: 25, cost: 25 };

export type SmartRouter = {
  id: string;
  name: string;
  description: string;
  /** The default router is used by everyone; it cannot be deleted. */
  isDefault: boolean;
  /** Groups that get this router besides the default one. */
  groupIds: string[];
  members: RouterMember[];
  /** Criteria weights; routers saved before weights existed use `defaultWeights`. */
  weights?: RouterWeights;
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

export type RoutableModel = {
  id: string;
  name: string;
  isAvailable: boolean;
  supportsImages: boolean;
  supportsTools: boolean;
  /** Optional figures for weighting; without them every candidate counts as average. */
  quality?: number;
  /** Output tokens per second. */
  tokensPerSecond?: number;
  /** Tomans per one million tokens; null or missing when no price is recorded. */
  costInputPerMillion?: number | null;
  costOutputPerMillion?: number | null;
};

export type RoutePick =
  | { ok: true; model: RoutableModel; complexity: Complexity; reason: string }
  | { ok: false; complexity: Complexity; reason: string };

const order: Tier[] = ["light", "medium", "heavy"];

/** Rough answer length per tier, used only for the estimate before a request runs. */
const outputTokensByTier: Record<Tier, number> = { light: 250, medium: 650, heavy: 1500 };

/** About 3.5 characters per token for mixed Persian and Latin text, plus the system prompt. */
export function estimateTokens(prompt: string, tier: Tier) {
  return { input: Math.round(prompt.trim().length / 3.5) + 350, output: outputTokensByTier[tier] };
}

/** Estimated cost in tomans of one answer from this model, or null when it has no recorded price. */
export function estimateCost(model: Pick<RoutableModel, "costInputPerMillion" | "costOutputPerMillion">, tokens: { input: number; output: number }): number | null {
  if (model.costInputPerMillion == null || model.costOutputPerMillion == null) return null;
  return (tokens.input / 1_000_000) * model.costInputPerMillion + (tokens.output / 1_000_000) * model.costOutputPerMillion;
}

export type RouteOption = {
  model: RoutableModel;
  tier: Tier;
  /** Steps between the member's tier and the tier the prompt needs. */
  distance: number;
  tokens: { input: number; output: number };
  estimatedCost: number | null;
  /** 0 to 100 per criterion, and the weighted total. */
  scores: RouterWeights;
  weighted: number;
};

/**
 * Every usable member with its estimated cost and weighted score. Cost and
 * speed are scored relative to the other candidates; a model with no price
 * counts as cheapest (it runs on the organization's own servers).
 */
export function rankOptions(
  router: Pick<SmartRouter, "members" | "weights">,
  usable: { member: RouterMember; model: RoutableModel }[],
  complexity: Complexity,
  prompt: string,
): RouteOption[] {
  const weights = router.weights ?? defaultWeights;
  const tokens = estimateTokens(prompt, complexity.tier);
  const costs = usable.map(({ model }) => estimateCost(model, tokens));
  const maxCost = Math.max(0, ...costs.map((c) => c ?? 0));
  const speeds = usable.map(({ model }) => model.tokensPerSecond ?? 40);
  const maxSpeed = Math.max(1, ...speeds);
  const total = weights.quality + weights.speed + weights.cost || 1;
  return usable.map(({ member, model }, i) => {
    const scores = {
      quality: model.quality ?? 70,
      speed: Math.round((speeds[i] / maxSpeed) * 100),
      cost: maxCost === 0 ? 100 : Math.round(100 - ((costs[i] ?? 0) / maxCost) * 90),
    };
    const weighted = Math.round((scores.quality * weights.quality + scores.speed * weights.speed + scores.cost * weights.cost) / total);
    return { model, tier: member.tier, distance: Math.abs(order.indexOf(member.tier) - order.indexOf(complexity.tier)), tokens, estimatedCost: costs[i], scores, weighted };
  });
}

/**
 * Chooses a member for the prompt: the wanted tier first, otherwise the
 * closest tier (a stronger one when two are equally close). Members whose model
 * is not usable now, or does not fit the files and tools, are skipped.
 */
export function pickModel(
  router: Pick<SmartRouter, "name" | "members" | "weights">,
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
  // Among members equally close to the needed tier, the criteria weights decide.
  const weighted = new Map(rankOptions(router, usable, complexity, prompt).map((option, i) => [usable[i], option.weighted]));
  const best = [...usable].sort(
    (a, b) =>
      distance(a.member.tier) - distance(b.member.tier) ||
      order.indexOf(b.member.tier) - order.indexOf(a.member.tier) ||
      (weighted.get(b) ?? 0) - (weighted.get(a) ?? 0),
  )[0];
  const exact = best.member.tier === complexity.tier;
  const reason = `مسیریاب هوشمند «${router.name}»: درخواست «${tierLabels[complexity.tier]}» تشخیص داده شد (${complexity.reasons.join("، ")}) و ${exact ? "" : "چون مدلی برای این سطح نبود، نزدیک‌ترین سطح یعنی «" + tierLabels[best.member.tier] + "» استفاده شد: "}«${best.model.name}» پاسخ داد.`;
  return { ok: true, model: best.model, complexity, reason };
}
