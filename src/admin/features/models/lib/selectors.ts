import type { AiModel, ModelProvider, SyncInterval } from "../types";

/** Same letters typed with Arabic keyboards match Persian ones. */
function normalize(value: string) {
  return value.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();
}

export function providerOf(model: AiModel, providers: ModelProvider[]) {
  return providers.find((p) => p.id === model.providerId);
}

export function modelsOfProvider(providerId: string, models: AiModel[]) {
  return models.filter((m) => m.providerId === providerId);
}

export function filterModels(
  models: AiModel[],
  providers: ModelProvider[],
  query: string,
): AiModel[] {
  const q = normalize(query);
  if (!q) return models;
  return models.filter(
    (m) =>
      normalize(m.displayName).includes(q) ||
      normalize(providerOf(m, providers)?.name ?? "").includes(q),
  );
}

/** A model of an unavailable provider is set aside from routing for now. */
export function isSetAside(model: AiModel, providers: ModelProvider[]) {
  return providerOf(model, providers)?.status === "unavailable";
}

/** Models published or first seen on or after this date count as new. */
const NEW_SINCE = Date.parse("2026-10-15T00:00:00.000Z");

export function isNewModel(model: AiModel) {
  return Boolean(model.releasedAt && Date.parse(model.releasedAt) >= NEW_SINCE);
}

export const syncLabels: Record<SyncInterval, string> = {
  off: "خاموش",
  "6h": "هر ۶ ساعت",
  "24h": "هر ۲۴ ساعت",
  "7d": "هر هفته",
};

const syncMs: Record<SyncInterval, number> = { off: 0, "6h": 6 * 3_600_000, "24h": 24 * 3_600_000, "7d": 7 * 86_400_000 };

/** Next scheduled fetch as an ISO date, or null when scheduling is off or the list was never fetched. */
export function nextSyncAt(provider: ModelProvider): string | null {
  const every = provider.syncEvery ?? "off";
  if (every === "off" || !provider.lastFetchedAt) return null;
  return new Date(Date.parse(provider.lastFetchedAt) + syncMs[every]).toISOString();
}
