import type { AiModel, ModelProvider } from "@/admin/features/models/types";
import type { UsageRecord } from "@/admin/features/usage-report/types";
import type { ProviderCredit } from "../types";
import { minutesAfter, seed } from "./seed";

/** Difference above this share of the recorded usage counts as a mismatch. */
export const MATCH_LIMIT = 0.02;

/**
 * Credit figures per registered provider. The provider-reported usage is the
 * recorded usage plus a small deterministic offset that changes with every
 * check; a real inquiry replaces it later.
 */
export function buildCredits(input: {
  providers: ModelProvider[];
  models: AiModel[];
  records: UsageRecord[];
  checks: Record<string, number | undefined>;
  nowIso: string;
}): ProviderCredit[] {
  const { providers, models, records, checks, nowIso } = input;
  const providerOfModel = new Map(models.map((m) => [m.id, m.providerId]));
  return providers.map((p) => {
    const own = models.filter((m) => m.providerId === p.id);
    const selfHostedOnly = own.length > 0 && own.every((m) => m.selfHosted);
    const rounds = checks[p.id] ?? 0;
    const recorded = records
      .filter((r) => providerOfModel.get(r.modelId) === p.id)
      .reduce((sum, r) => sum + r.inputTokens + r.outputTokens, 0);
    const offset = ((seed(`${p.id}-${rounds}`) % 9) - 3) / 100;
    const reported = Math.round(recorded * (1 + offset));
    const difference = recorded === 0 ? 0 : (reported - recorded) / recorded;
    return {
      providerId: p.id,
      name: p.name,
      state: selfHostedOnly ? "noCredit" : p.status === "available" ? "available" : "unavailable",
      purchasedTokens: 5_000_000 + (seed(p.id) % 10) * 1_000_000,
      reportedTokens: reported,
      recordedTokens: recorded,
      difference,
      matches: Math.abs(difference) <= MATCH_LIMIT,
      checkedAt: minutesAfter(nowIso, rounds),
    };
  });
}
