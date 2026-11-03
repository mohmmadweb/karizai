"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultPolicies, type Policies } from "@/lib/policies";

const PoliciesContext = createContext<Policies | null>(null);

/** The policies the admin saved, loaded from `/api/policies`; until they arrive the defaults apply. */
export function PoliciesProvider({ children }: { children: ReactNode }) {
  const [policies, setPolicies] = useState<Policies>(() => defaultPolicies());

  useEffect(() => {
    fetch("/api/policies")
      .then((response) => response.json() as Promise<{ policies: Policies }>)
      .then((data) => setPolicies(data.policies))
      .catch(() => undefined);
  }, []);

  const value = useMemo(() => policies, [policies]);
  return <PoliciesContext.Provider value={value}>{children}</PoliciesContext.Provider>;
}

export function usePolicies(): Policies {
  const value = useContext(PoliciesContext);
  if (!value) throw new Error("usePolicies must be used inside PoliciesProvider");
  return value;
}
