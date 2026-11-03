import type {
  SyncInterval,
  AiModel,
  ModelFeaturesInput,
  ModelInfoInput,
  ModelProvider,
} from "../types";

export type ModelsState = {
  providers: ModelProvider[];
  models: AiModel[];
  /** Counters for ids of records created in this browser session. */
  nextProvider: number;
  nextModel: number;
};

export type ModelsAction =
  | { type: "addProvider"; name: string; baseUrl: string; now: string }
  | { type: "updateProvider"; id: string; name: string; baseUrl: string; newKey: boolean }
  | { type: "deleteProvider"; id: string }
  | { type: "mergeFetched"; providerId: string; remoteIds: string[]; now: string }
  | { type: "setEnabled"; id: string; enabled: boolean }
  | { type: "updateInfo"; id: string; input: ModelInfoInput }
  | { type: "updateFeatures"; id: string; input: ModelFeaturesInput }
  | { type: "setSync"; id: string; every: SyncInterval }
  | { type: "replaceAll"; providers: ModelProvider[]; models: AiModel[] };

export function createModelsState(
  providers: ModelProvider[],
  models: AiModel[],
): ModelsState {
  return {
    providers,
    models,
    nextProvider: nextNumber(providers.map((p) => p.id)),
    nextModel: nextNumber(models.map((m) => m.id)),
  };
}

/** One more than the highest number at the end of the ids, so new ids never repeat. */
function nextNumber(ids: string[]) {
  return Math.max(0, ...ids.map((id) => Number(id.split("-").pop()) || 0)) + 1;
}

export const padId = (prefix: string, n: number) =>
  `${prefix}-${String(n).padStart(3, "0")}`;

const patchModel = (state: ModelsState, id: string, patch: Partial<AiModel>) => ({
  ...state,
  models: state.models.map((m) => (m.id === id ? { ...m, ...patch } : m)),
});

export function modelsReducer(state: ModelsState, action: ModelsAction): ModelsState {
  switch (action.type) {
    case "addProvider": {
      const provider: ModelProvider = {
        id: padId("provider", state.nextProvider),
        name: action.name.trim(),
        baseUrl: action.baseUrl.trim(),
        hasApiKey: true,
        status: "available",
        lastFetchedAt: null,
        createdAt: action.now,
      };
      return { ...state, providers: [...state.providers, provider], nextProvider: state.nextProvider + 1 };
    }
    case "updateProvider":
      return {
        ...state,
        providers: state.providers.map((p) =>
          p.id === action.id
            ? { ...p, name: action.name.trim(), baseUrl: action.baseUrl.trim(), hasApiKey: p.hasApiKey || action.newKey }
            : p,
        ),
      };
    case "deleteProvider":
      return {
        ...state,
        providers: state.providers.filter((p) => p.id !== action.id),
        models: state.models.filter((m) => m.providerId !== action.id),
      };
    case "mergeFetched": {
      if (!state.providers.some((p) => p.id === action.providerId)) return state;
      const known = new Set(
        state.models.filter((m) => m.providerId === action.providerId).map((m) => m.remoteId),
      );
      let next = state.nextModel;
      const added: AiModel[] = action.remoteIds
        .filter((remoteId) => !known.has(remoteId))
        .map((remoteId) => ({
          id: padId("model", next++),
          providerId: action.providerId,
          remoteId,
          displayName: remoteId,
          description: "",
          enabled: false,
          selfHosted: false,
          costInputPerMillion: null,
          costOutputPerMillion: null,
          supportsImages: false,
          supportsTools: false,
          contextWindow: null,
          releasedAt: action.now,
        }));
      return {
        ...state,
        providers: state.providers.map((p) =>
          p.id === action.providerId ? { ...p, lastFetchedAt: action.now } : p,
        ),
        models: [...state.models, ...added],
        nextModel: next,
      };
    }
    case "setEnabled":
      return patchModel(state, action.id, { enabled: action.enabled });
    case "updateInfo":
      return patchModel(state, action.id, {
        displayName: action.input.displayName.trim(),
        description: action.input.description.trim(),
        selfHosted: action.input.selfHosted,
      });
    case "updateFeatures":
      return patchModel(state, action.id, action.input);
    case "setSync":
      return { ...state, providers: state.providers.map((p) => (p.id === action.id ? { ...p, syncEvery: action.every } : p)) };
    case "replaceAll":
      return createModelsState(action.providers, action.models);
  }
}
