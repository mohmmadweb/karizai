import type { AiModel, ModelProvider } from "@/admin/features/models/types";
import { getPeriodFigures } from "../data/telemetry";
import type { Complexity, DashboardPeriod, ModelSpeed, Timing } from "../types";
import { seed } from "./seed";

export const complexityLabels: Record<Complexity, string> = {
  simple: "کار ساده",
  medium: "کار متوسط",
  complex: "کار پیچیده",
};

export const complexities = Object.keys(complexityLabels) as Complexity[];

const multiplier: Record<Complexity, number> = { simple: 1, medium: 2.6, complex: 5.5 };

/**
 * Figures derived from the model id and the period. They stand in for real
 * measurements; self-hosted models answer their first word later.
 */
export function speedFor(model: AiModel, providerName: string, period: DashboardPeriod): ModelSpeed {
  const n = seed(model.id);
  const factor = getPeriodFigures(period).speedFactor;
  const timing = (median: number, spread: number): Timing => ({
    medianMs: Math.round(median * factor),
    p95Ms: Math.round(median * factor * (spread + (n % 5) / 10)),
  });
  const ttftBase = 350 + (n % 900) + (model.selfHosted ? 600 : 0);
  const e2eBase = 1200 + (n % 600);
  return {
    modelId: model.id,
    name: model.displayName,
    providerName,
    selfHosted: model.selfHosted,
    ttft: timing(ttftBase, 1.8),
    tokensPerSecond: Math.round((35 + (n % 60) - (model.selfHosted ? 10 : 0)) / factor),
    e2e: {
      simple: timing(e2eBase * multiplier.simple, 1.8),
      medium: timing(e2eBase * multiplier.medium, 1.8),
      complex: timing(e2eBase * multiplier.complex, 1.8),
    },
  };
}

/** Enabled models whose provider answers; disabled ones and unavailable providers are left out. */
export function modelSpeeds(
  models: AiModel[],
  providers: ModelProvider[],
  period: DashboardPeriod,
): ModelSpeed[] {
  const providerOf = new Map(providers.map((p) => [p.id, p]));
  return models
    .filter((m) => m.enabled && providerOf.get(m.providerId)?.status === "available")
    .map((m) => speedFor(m, providerOf.get(m.providerId)!.name, period));
}

/** Seconds above one second, otherwise milliseconds, with Persian digits. */
export function formatDuration(ms: number) {
  const fmt = (value: number, options?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat("fa-IR", options).format(value);
  return ms >= 1000
    ? `${fmt(ms / 1000, { maximumFractionDigits: 1 })} ثانیه`
    : `${fmt(Math.round(ms))} میلی‌ثانیه`;
}
