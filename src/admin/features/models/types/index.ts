export type ProviderStatus = "available" | "unavailable";

/** The API key is never part of a provider record; only whether one exists. */
export type ModelProvider = {
  id: string;
  name: string;
  baseUrl: string;
  hasApiKey: boolean;
  status: ProviderStatus;
  /** ISO date string, or null when the models list was never received. */
  lastFetchedAt: string | null;
  /** ISO date string. */
  createdAt: string;
};

export type AiModel = {
  id: string;
  providerId: string;
  /** Name of the model at the provider; read-only. */
  remoteId: string;
  displayName: string;
  description: string;
  enabled: boolean;
  selfHosted: boolean;
  /** Cost per one million tokens; null when not recorded. */
  costInputPerMillion: number | null;
  costOutputPerMillion: number | null;
  supportsImages: boolean;
  supportsTools: boolean;
  /** Number of tokens; null when not recorded. */
  contextWindow: number | null;
};

/** The key is passed to the action and discarded; it is never stored. */
export type NewProviderInput = { name: string; baseUrl: string; apiKey: string };

/** An empty `apiKey` keeps the current key. */
export type ProviderEditInput = NewProviderInput;

export type ModelInfoInput = {
  displayName: string;
  description: string;
  selfHosted: boolean;
};

export type ModelFeaturesInput = {
  costInputPerMillion: number | null;
  costOutputPerMillion: number | null;
  supportsImages: boolean;
  supportsTools: boolean;
  contextWindow: number | null;
};

/** Result of a state action: an error message in Persian, or success. */
export type ActionResult = { ok: true } | { ok: false; error: string };

export type AddProviderResult = { ok: true; id: string } | { ok: false; error: string };

export type FetchStatus = "fetching" | "error";

/** Live figures of one model, shown in the provider's models table. */
export type ModelMetrics = {
  /** Median answer time in milliseconds. */
  latencyMs: number;
  /** Tokens used in the last 24 hours. */
  tokensUsed24h: number;
  /** Tokens left in the provider's allowance; null when the provider does not report it. */
  tokensRemaining: number | null;
  /** ISO date string; null when the model was never used. */
  lastUsedAt: string | null;
};
