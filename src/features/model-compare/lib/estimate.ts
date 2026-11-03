import type { CatalogModel } from "@/features/model-catalog/types";
import type { CompareTask } from "../data/tasks";

export type RunMode = "direct" | "multi";
export type RunResult = { seconds: number; tokens: number; cost: number };

const seedOf = (text: string) => [...text].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 9973, 7);

/**
 * Fixed figures for one model and task under the same conditions: the same task and input for
 * both modes. A multi-agent run splits the work in three parallel steps, so it answers sooner
 * but uses more tokens for the hand-offs. Models on the organization's own servers are slower
 * and cost less per token.
 */
export function estimateRun(model: CatalogModel, task: CompareTask, mode: RunMode): RunResult {
  const seed = seedOf(`${model.id}:${task.id}`);
  const speed = model.isInternal ? 34 + (seed % 8) : 62 + (seed % 38);
  const firstToken = (model.isInternal ? 1.6 : 0.7) + (seed % 6) / 10;
  const pricePer1k = model.isInternal ? 160 : 700 + (seed % 12) * 90;
  const generate = task.outputTokens / speed;
  const seconds = mode === "direct" ? firstToken + generate : firstToken * 1.4 + generate * 0.5 + 2.2;
  const tokens = Math.round((task.inputTokens + task.outputTokens) * (mode === "direct" ? 1 : 1.65));
  return { seconds: Math.round(seconds * 10) / 10, tokens, cost: Math.round((tokens / 1000) * pricePer1k) };
}
