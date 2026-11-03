"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultPolicies, type Policies } from "@/lib/policies";
import { hasServer } from "@/lib/static-params";

/**
 * One source of policies for both panels. With a server the admin saves them in
 * `policies.json` through `/api/policies` and the user panel reads the same
 * file. On the static demo there is no server: the policies live in memory for
 * the visit, start from the Parsa Polymer sample below, and an admin change is
 * seen by the user panel at once (a refresh returns to the sample).
 */

/** Sample policies of the demo: weekly toman ceilings, phrases to hide, confidential files and read-only tools. */
export function demoPolicies(): Policies {
  const base = defaultPolicies();
  return {
    ...base,
    confidentialDocumentIds: ["doc-001", "doc-003"],
    weeklyLimits: { "group-001": 4_000_000, "group-002": 2_000_000, "group-003": 6_000_000, "group-005": 1_000_000 },
    masking: {
      fields: base.masking.fields,
      phrases: [
        { id: "phrase-1", phrase: "بودجه‌ی شرکت", withNumber: true },
        { id: "phrase-2", phrase: "قیمت فروش", withNumber: true },
        { id: "phrase-3", phrase: "فرمول کامپاند", withNumber: false },
      ],
    },
    toolAccess: { "group-001": { "conn-3": "read" }, "group-005": { "conn-4": "read" } },
  };
}

type PoliciesAdminValue = {
  policies: Policies;
  /** True until the first read finishes. */
  loading: boolean;
  /** Message of the last failed read, or null. */
  loadError: string | null;
  saving: boolean;
  reload: () => void;
  /** Saves the whole policies object; false when the save failed. */
  savePolicies: (next: Policies) => Promise<boolean>;
  /** Changes the confidential flag of one document and saves. */
  setConfidential: (documentId: string, flag: boolean, currentIds: string[]) => Promise<boolean>;
};

const PoliciesContext = createContext<PoliciesAdminValue | null>(null);

export function PoliciesProvider({ children }: { children: ReactNode }) {
  const [policies, setPolicies] = useState<Policies>(() => (hasServer ? defaultPolicies() : demoPolicies()));
  const [loading, setLoading] = useState(hasServer);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!hasServer) return;
    let alive = true;
    fetch("/api/policies")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("read"))))
      .then((body: { policies: Policies }) => {
        if (!alive) return;
        setPolicies(body.policies);
        setLoadError(null);
      })
      .catch(() => alive && setLoadError("خواندن سیاست‌ها شکست خورد."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [round]);

  const reload = useCallback(() => {
    if (!hasServer) return;
    setLoading(true);
    setRound((r) => r + 1);
  }, []);

  const savePolicies = useCallback(async (next: Policies) => {
    if (!hasServer) {
      setPolicies(next);
      return true;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/policies", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ policies: next }) });
      if (!res.ok) return false;
      setPolicies(next);
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const value = useMemo<PoliciesAdminValue>(
    () => ({
      policies,
      loading,
      loadError,
      saving,
      reload,
      savePolicies,
      setConfidential: (documentId, flag, currentIds) => {
        const rest = currentIds.filter((id) => id !== documentId);
        return savePolicies({ ...policies, confidentialDocumentIds: flag ? [...rest, documentId] : rest });
      },
    }),
    [policies, loading, loadError, saving, reload, savePolicies],
  );

  return <PoliciesContext.Provider value={value}>{children}</PoliciesContext.Provider>;
}

/** The policies in force (user panel: chat masking, confidential files, read-only tools). */
export function usePolicies(): Policies {
  return usePoliciesAdmin().policies;
}

/** Reading and saving, for the admin panel's «سیاست‌ها» page. */
export function usePoliciesAdmin(): PoliciesAdminValue {
  const value = useContext(PoliciesContext);
  if (!value) throw new Error("usePolicies must be used inside PoliciesProvider");
  return value;
}
