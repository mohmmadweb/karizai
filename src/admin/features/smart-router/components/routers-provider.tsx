"use client";

import { hasServer } from "@/lib/static-params";
import { nextFreeId } from "@/lib/static-params";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { SmartRouter } from "@/lib/smart-routing";
import { getSampleRouters } from "../data/routers";

type RoutersContextValue = {
  routers: SmartRouter[];
  /** Returns the id of the new router. */
  addRouter: (name: string, description: string) => string;
  updateRouter: (id: string, change: Partial<Omit<SmartRouter, "id" | "isDefault">>) => void;
  /** The default router cannot be removed. */
  removeRouter: (id: string) => void;
};

const RoutersContext = createContext<RoutersContextValue | null>(null);

/**
 * Smart routers of the organization. They are loaded from the server store
 * (`/api/routers`) and every change is saved back after a short wait.
 */
export function RoutersProvider({ children }: { children: ReactNode }) {
  const [routers, setRouters] = useState<SmartRouter[]>(getSampleRouters);
  /** loaded: the server store answered, so changes are saved back. ready: show the page (with samples when there is no server). */
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasServer) { setReady(true); return; }
    fetch("/api/admin/routers")
      .then((response) => { if (!response.ok) throw new Error(String(response.status)); return response.json() as Promise<{ routers: SmartRouter[] }>; })
      .then((data) => { setRouters(data.routers); setLoaded(true); })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      void fetch("/api/admin/routers", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ routers }) }).catch(() => undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [loaded, routers]);

  const value = useMemo<RoutersContextValue>(
    () => ({
      routers,
      addRouter: (name, description) => {
        const id = nextFreeId("router-new", routers.map((item) => item.id));
        setRouters((list) => [...list, { id, name: name.trim(), description: description.trim(), isDefault: false, groupIds: [], members: [] }]);
        return id;
      },
      updateRouter: (id, change) => setRouters((list) => list.map((item) => (item.id === id ? { ...item, ...change } : item))),
      removeRouter: (id) => setRouters((list) => list.filter((item) => item.id !== id || item.isDefault)),
    }),
    [routers],
  );

  return <RoutersContext.Provider value={value}>{ready ? children : null}</RoutersContext.Provider>;
}

export function useRouters(): RoutersContextValue {
  const value = useContext(RoutersContext);
  if (!value) throw new Error("useRouters must be used inside RoutersProvider");
  return value;
}
