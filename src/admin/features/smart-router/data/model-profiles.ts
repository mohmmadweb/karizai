import type { AiModel } from "@/admin/features/models/types";

/** Measured behaviour of a model, used by the router weights and the benchmark. */
export type ModelProfile = {
  /** Supervisor score on the organization's evaluation set, 0 to 100. */
  quality: number;
  /** Output tokens per second. */
  tokensPerSecond: number;
  /** Time to first token in milliseconds. */
  ttftMs: number;
  /** Tomans per one million tokens for models on the organization's servers (power and hardware share). */
  internalCostPerMillion: number;
};

const profiles: Record<string, ModelProfile> = {
  "model-001": { quality: 92, tokensPerSecond: 78, ttftMs: 620, internalCostPerMillion: 0 },
  "model-002": { quality: 90, tokensPerSecond: 64, ttftMs: 780, internalCostPerMillion: 0 },
  "model-003": { quality: 80, tokensPerSecond: 52, ttftMs: 900, internalCostPerMillion: 0 },
  "model-004": { quality: 84, tokensPerSecond: 46, ttftMs: 380, internalCostPerMillion: 18000 },
  "model-005": { quality: 68, tokensPerSecond: 120, ttftMs: 160, internalCostPerMillion: 4000 },
  "model-006": { quality: 83, tokensPerSecond: 58, ttftMs: 840, internalCostPerMillion: 0 },
  "model-007": { quality: 71, tokensPerSecond: 95, ttftMs: 520, internalCostPerMillion: 0 },
  "model-008": { quality: 87, tokensPerSecond: 52, ttftMs: 340, internalCostPerMillion: 15000 },
  "model-009": { quality: 93, tokensPerSecond: 82, ttftMs: 560, internalCostPerMillion: 0 },
};

function seed(id: string) {
  return [...id].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 9973, 7);
}

/** Known figures for the sample models; others get stable figures from their id. */
export function getModelProfile(model: Pick<AiModel, "id" | "selfHosted">): ModelProfile {
  const known = profiles[model.id];
  if (known) return known;
  const n = seed(model.id);
  return model.selfHosted
    ? { quality: 70 + (n % 15), tokensPerSecond: 40 + (n % 60), ttftMs: 250 + (n % 300), internalCostPerMillion: 8000 + (n % 10) * 1000 }
    : { quality: 75 + (n % 18), tokensPerSecond: 50 + (n % 40), ttftMs: 500 + (n % 500), internalCostPerMillion: 0 };
}

/** Price per million tokens as the router sees it: the provider price, or the internal cost for self-hosted models. */
export function routingPrice(model: AiModel): { input: number | null; output: number | null } {
  if (model.costInputPerMillion !== null && model.costOutputPerMillion !== null) {
    return { input: model.costInputPerMillion, output: model.costOutputPerMillion };
  }
  if (model.selfHosted) {
    const internal = getModelProfile(model).internalCostPerMillion;
    return { input: internal, output: internal };
  }
  return { input: null, output: null };
}
