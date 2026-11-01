"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCurrentUser } from "@/features/user-session/data/session";
import { combinePolicies, type ApiKeyKind, type ApiKeyPolicy, type ApiKeyRecord } from "@/lib/api-keys";

export type NewKeyInput = { name: string; kind: ApiKeyKind; resourceId: string; resourceName: string; expiresInDays: number | null };

type ApiKeysContextValue = {
  /** The user's own keys. */
  keys: ApiKeyRecord[];
  /** What the user's groups allow together; no kinds means the user cannot create keys. */
  allowed: { kinds: ApiKeyKind[]; monthlyTokenLimit: number | null };
  /** Returns the key text once, or an error message. */
  createKey: (input: NewKeyInput) => Promise<{ secret: string } | { error: string }>;
  revokeKey: (id: string) => Promise<boolean>;
};

const ApiKeysContext = createContext<ApiKeysContextValue | null>(null);

/**
 * Keys of the current user. The admin's rules (`/api/api-keys`) say what the
 * user's groups may create; the server keeps only a hash of each key.
 */
export function ApiKeysProvider({ children }: { children: ReactNode }) {
  const [policies, setPolicies] = useState<ApiKeyPolicy[]>([]);
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    fetch(`/api/api-keys?ownerId=${encodeURIComponent(user.id)}`)
      .then((response) => response.json() as Promise<{ policies: ApiKeyPolicy[]; keys: ApiKeyRecord[] }>)
      .then((data) => {
        setPolicies(data.policies);
        setKeys(data.keys);
      })
      .catch(() => undefined);
  }, [user.id]);

  const createKey = useCallback<ApiKeysContextValue["createKey"]>(
    async (input) => {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, ownerId: user.id, ownerName: user.name, groupIds: user.groupIds }),
      }).catch(() => null);
      const data = (await response?.json().catch(() => null)) as { key?: ApiKeyRecord; secret?: string; error?: string } | null;
      if (!response?.ok || !data?.key || !data.secret) return { error: data?.error ?? "ساخت کلید انجام نشد. دوباره تلاش کنید." };
      const created = data.key;
      setKeys((list) => [...list, created]);
      return { secret: data.secret };
    },
    [user.id, user.name, user.groupIds],
  );

  const value = useMemo<ApiKeysContextValue>(
    () => ({
      keys,
      allowed: combinePolicies(policies, user.groupIds),
      createKey,
      revokeKey: async (id) => {
        const response = await fetch(`/api/api-keys/${id}/revoke`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ownerId: user.id }) }).catch(() => null);
        if (!response?.ok) return false;
        setKeys((list) => list.map((key) => (key.id === id ? { ...key, revokedAt: new Date().toISOString() } : key)));
        return true;
      },
    }),
    [keys, policies, user.groupIds, user.id, createKey],
  );

  return <ApiKeysContext.Provider value={value}>{children}</ApiKeysContext.Provider>;
}

export function useApiKeys(): ApiKeysContextValue {
  const value = useContext(ApiKeysContext);
  if (!value) throw new Error("useApiKeys must be used inside ApiKeysProvider");
  return value;
}
