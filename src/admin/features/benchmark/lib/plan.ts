import type { AiModel } from "@/admin/features/models/types";
import { getModelProfile } from "@/admin/features/smart-router/data/model-profiles";
import { tomanPer1kTokens } from "@/lib/policy-store";
import type { BenchmarkPreset } from "../data/presets";

export type Mode = "direct" | "multi";

export type Planned = {
  modelId: string;
  name: string;
  internal: boolean;
  ttftMs: number;
  e2eMs: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  score: number;
};

const rate = (internal: boolean) => (internal ? tomanPer1kTokens.internal : tomanPer1kTokens.external);

export const costOf = (tokens: number, internal: boolean) => (tokens / 1000) * rate(internal);

/** Stable small variation per model and question, so runs look measured but repeat. */
function jitter(a: string, b: string) {
  const n = [...(a + b)].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 997, 3);
  return 0.9 + (n % 21) / 100;
}

/**
 * The result each model will reach in this run. Multi-agent runs plan, call
 * tools and review, so they use more tokens and time but score higher.
 */
export function planRun(model: AiModel, preset: BenchmarkPreset, prompt: string, mode: Mode): Planned {
  const p = getModelProfile(model);
  const j = jitter(model.id, preset.id + mode);
  const multi = mode === "multi";
  const inputTokens = Math.round((prompt.length / 3.5 + 900) * (multi ? 3.2 : 1));
  const outputTokens = Math.round(preset.outputTokens * j * (multi ? 2.2 : 1));
  const ttftMs = Math.round(p.ttftMs * j * (multi ? 2.4 : 1));
  const e2eMs = Math.round(ttftMs + (outputTokens / p.tokensPerSecond) * 1000 + (multi ? 2600 : 0));
  const score = Math.min(99, Math.round(p.quality - preset.difficulty * (100 - p.quality) / 40 + (multi ? 6 : 0) + (j - 1) * 20));
  return { modelId: model.id, name: model.displayName, internal: model.selfHosted, ttftMs, e2eMs, inputTokens, outputTokens, cost: costOf(inputTokens + outputTokens, model.selfHosted), score };
}

/** Same weights as the default router: half quality, a quarter each speed and cost. */
export function winnerOf(rows: Planned[]): string | null {
  if (rows.length === 0) return null;
  const minTime = Math.min(...rows.map((r) => r.e2eMs));
  const minCost = Math.min(...rows.map((r) => r.cost));
  const value = (r: Planned) => r.score * 0.5 + (minTime / r.e2eMs) * 25 + (minCost / r.cost) * 25;
  return [...rows].sort((a, b) => value(b) - value(a))[0].modelId;
}
