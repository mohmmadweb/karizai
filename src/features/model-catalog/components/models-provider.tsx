"use client";

import { hasServer } from "@/lib/static-params";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCurrentUser } from "@/features/user-session/data/session";
import type { SmartRouter } from "@/lib/smart-routing";
import { getAvailableModels } from "../data/models";
import type { CatalogModel } from "../types";

type ModelsContextValue = {
  models: CatalogModel[];
  /** True when the list comes from registered providers. */
  isReal: boolean;
  /** Smart routers that apply to this user: the default one and those of the user's groups. */
  routers: SmartRouter[];
  modelById: (id: string) => CatalogModel | undefined;
};

const ModelsContext = createContext<ModelsContextValue | null>(null);

/**
 * Models the user may use. They are loaded from `/api/models` (enabled models
 * of the providers the admin registered). Without any, the sample list stays.
 */
export function ModelsProvider({ children }: { children: ReactNode }) {
  const [real, setReal] = useState<CatalogModel[]>([]);
  const [allRouters, setAllRouters] = useState<SmartRouter[]>([]);

  useEffect(() => {
    if (!hasServer) return;
    fetch("/api/models")
      .then((response) => response.json() as Promise<{ models: CatalogModel[] }>)
      .then((data) => setReal(data.models.map((model) => ({ ...model, isReal: true }))))
      .catch(() => undefined);
    fetch("/api/routers")
      .then((response) => response.json() as Promise<{ routers: SmartRouter[] }>)
      .then((data) => setAllRouters(data.routers))
      .catch(() => undefined);
  }, []);

  const value = useMemo<ModelsContextValue>(() => {
    const models = real.length > 0 ? real : getAvailableModels();
    const groupIds = getCurrentUser().groupIds;
    // Routers only make sense for real models; the sample list has no router.
    const routers = real.length > 0 ? allRouters.filter((router) => router.isDefault || router.groupIds.some((id) => groupIds.includes(id))) : [];
    return { models, isReal: real.length > 0, routers, modelById: (id) => models.find((model) => model.id === id) };
  }, [real, allRouters]);

  return <ModelsContext.Provider value={value}>{children}</ModelsContext.Provider>;
}

export function useModels(): ModelsContextValue {
  const value = useContext(ModelsContext);
  if (!value) throw new Error("useModels must be used inside ModelsProvider");
  return value;
}
