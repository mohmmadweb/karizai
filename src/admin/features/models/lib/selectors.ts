import type { AiModel, ModelProvider } from "../types";

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
