"use client";

import { hasServer } from "@/lib/static-params";
import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useProviderFetch } from "../hooks/use-provider-fetch";
import { createModelsState, modelsReducer, padId } from "../lib/models-reducer";
import { modelsOfProvider } from "../lib/selectors";
import type {
  ActionResult,
  AddProviderResult,
  AiModel,
  FetchStatus,
  ModelFeaturesInput,
  ModelInfoInput,
  ModelProvider,
  NewProviderInput,
  ProviderEditInput,
} from "../types";

export type ModelsContextValue = {
  providers: ModelProvider[];
  models: AiModel[];
  fetchStatus: Record<string, FetchStatus | undefined>;
  addProvider: (input: NewProviderInput) => AddProviderResult;
  updateProvider: (id: string, input: ProviderEditInput) => ActionResult;
  /** Returns the ids of the models that were removed with the provider. */
  deleteProvider: (id: string) => string[];
  /** Asks the provider for its models through the server; shows progress and a short message. */
  fetchModels: (providerId: string, baseUrl: string) => Promise<void>;
  setModelEnabled: (id: string, enabled: boolean) => void;
  updateModelInfo: (id: string, input: ModelInfoInput) => ActionResult;
  updateModelFeatures: (id: string, input: ModelFeaturesInput) => void;
};

export const ModelsContext = createContext<ModelsContextValue | null>(null);

const fail = (error: string) => ({ ok: false, error }) as const;
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

type ModelsProviderProps = {
  initialProviders: ModelProvider[];
  initialModels: AiModel[];
  children: ReactNode;
};

/**
 * State shared by the models page and the model page. It is loaded from the
 * server store (`/api/store`) and every change is saved back there; API keys
 * are sent separately and never kept here.
 */
export function ModelsProvider({ initialProviders, initialModels, children }: ModelsProviderProps) {
  const [state, dispatch] = useReducer(
    modelsReducer,
    undefined,
    () => createModelsState(initialProviders, initialModels),
  );
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  });

  // Only a reachable server store is written back; without one (the static demo) the sample data stays in memory.
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!hasServer) { setReady(true); return; }
    fetch("/api/admin/store")
      .then((response) => { if (!response.ok) throw new Error(String(response.status)); return response.json() as Promise<{ providers: ModelProvider[]; models: AiModel[] }>; })
      .then((data) => { dispatch({ type: "replaceAll", providers: data.providers, models: data.models }); setLoaded(true); })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      void fetch("/api/admin/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providers: state.providers, models: state.models }),
      }).catch(() => undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [loaded, state.providers, state.models]);

  const { fetchStatus, fetchModels } = useProviderFetch({
    countNew: (providerId, remoteIds) => {
      const known = new Set(
        modelsOfProvider(providerId, latest.current.models).map((m) => m.remoteId),
      );
      return remoteIds.filter((id) => !known.has(id)).length;
    },
    onReceived: (providerId, remoteIds, now) =>
      dispatch({ type: "mergeFetched", providerId, remoteIds, now }),
  });

  const value = useMemo<ModelsContextValue>(() => {
    const nameTaken = (name: string, exceptId?: string) =>
      state.providers.some((p) => p.id !== exceptId && same(p.name, name));
    return {
      providers: state.providers,
      models: state.models,
      fetchStatus,
      addProvider: (input) => {
        if (nameTaken(input.name)) return fail("ارائه‌دهنده‌ای با این نام وجود دارد.");
        dispatch({ type: "addProvider", name: input.name, baseUrl: input.baseUrl, now: new Date().toISOString() });
        return { ok: true, id: padId("provider", state.nextProvider) };
      },
      updateProvider: (id, input) => {
        if (nameTaken(input.name, id)) return fail("ارائه‌دهنده‌ای با این نام وجود دارد.");
        dispatch({ type: "updateProvider", id, name: input.name, baseUrl: input.baseUrl, newKey: Boolean(input.apiKey.trim()) });
        return { ok: true };
      },
      deleteProvider: (id) => {
        const removed = modelsOfProvider(id, state.models).map((m) => m.id);
        dispatch({ type: "deleteProvider", id });
        return removed;
      },
      fetchModels,
      setModelEnabled: (id, enabled) => dispatch({ type: "setEnabled", id, enabled }),
      updateModelInfo: (id, input) => {
        if (!input.displayName.trim()) return fail("نام نمایشی را وارد کنید.");
        dispatch({ type: "updateInfo", id, input });
        return { ok: true };
      },
      updateModelFeatures: (id, input) => dispatch({ type: "updateFeatures", id, input }),
    };
  }, [state, fetchStatus, fetchModels]);

  return <ModelsContext.Provider value={value}>{ready ? children : null}</ModelsContext.Provider>;
}
