import type { ModelMetrics } from "../types";

/** Stable figures derived from the model id, so the same model always shows the same numbers. */
function seed(id: string) {
  return [...id].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 9973, 7);
}

/**
 * Figures for one model. Models that are not enabled have no traffic.
 * The numbers stand in for the real measurements of the later backend.
 */
export function getModelMetrics(modelId: string, enabled: boolean): ModelMetrics {
  const n = seed(modelId);
  if (!enabled) return { latencyMs: 0, tokensUsed24h: 0, tokensRemaining: null, lastUsedAt: null };
  return {
    latencyMs: 380 + (n % 1400),
    tokensUsed24h: 12000 + (n % 90) * 4300,
    tokensRemaining: 600000 + (n % 40) * 35000,
    lastUsedAt: new Date(Date.UTC(2026, 9, 24, 8, 0) - (n % 600) * 60000).toISOString(),
  };
}
