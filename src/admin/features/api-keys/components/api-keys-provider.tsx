"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ApiKeyPolicy, ApiKeyRecord } from "@/lib/api-keys";
import { getSampleKeys, getSamplePolicies } from "../data/api-keys";

type ApiKeysContextValue = {
  /** False until the first read from the server finished. */
  loaded: boolean;
  policies: ApiKeyPolicy[];
  keys: ApiKeyRecord[];
  /** What a group may do; a group nobody configured may do nothing. */
  policyOf: (groupId: string) => ApiKeyPolicy;
  setPolicy: (groupId: string, change: Partial<Omit<ApiKeyPolicy, "groupId">>) => void;
  revokeKey: (id: string) => Promise<boolean>;
};

const ApiKeysContext = createContext<ApiKeysContextValue | null>(null);

/**
 * Policies and keys of the API keys area. They are loaded from the server
 * store (`/api/api-keys`); policy changes are saved after a short wait. The
 * keys themselves are never here: the server keeps only a hash.
 */
export function ApiKeysProvider({ children }: { children: ReactNode }) {
  const [policies, setPolicies] = useState<ApiKeyPolicy[]>(getSamplePolicies);
  const [keys, setKeys] = useState<ApiKeyRecord[]>(getSampleKeys);
  const [loaded, setLoaded] = useState(false);
  // True only when the server store answered; the static demo keeps the samples in memory.
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    fetch("/api/admin/api-keys")
      .then((response) => { if (!response.ok) throw new Error(String(response.status)); return response.json() as Promise<{ policies: ApiKeyPolicy[]; keys: ApiKeyRecord[] }>; })
      .then((data) => {
        setPolicies(data.policies);
        setKeys(data.keys);
        setSynced(true);
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!synced) return;
    const timer = setTimeout(() => {
      void fetch("/api/admin/api-keys", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ policies }) }).catch(() => undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [synced, policies]);

  const value = useMemo<ApiKeysContextValue>(
    () => ({
      loaded,
      policies,
      keys,
      policyOf: (groupId) => policies.find((policy) => policy.groupId === groupId) ?? { groupId, kinds: [], monthlyTokenLimit: null },
      setPolicy: (groupId, change) =>
        setPolicies((list) =>
          list.some((policy) => policy.groupId === groupId)
            ? list.map((policy) => (policy.groupId === groupId ? { ...policy, ...change } : policy))
            : [...list, { groupId, kinds: [], monthlyTokenLimit: null, ...change }],
        ),
      revokeKey: async (id) => {
        const response = await fetch(`/api/admin/api-keys/${id}/revoke`, { method: "POST" }).catch(() => null);
        if (!response?.ok) return false;
        setKeys((list) => list.map((key) => (key.id === id ? { ...key, revokedAt: new Date().toISOString() } : key)));
        return true;
      },
    }),
    [loaded, policies, keys],
  );

  return <ApiKeysContext.Provider value={value}>{children}</ApiKeysContext.Provider>;
}

export function useApiKeys(): ApiKeysContextValue {
  const value = useContext(ApiKeysContext);
  if (!value) throw new Error("useApiKeys must be used inside ApiKeysProvider");
  return value;
}
