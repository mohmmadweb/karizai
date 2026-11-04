"use client";

import { hasServer } from "@/lib/static-params";
import { nextFreeId } from "@/lib/static-params";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ConnectionType, DefinedConnection, DefinedTool } from "@/lib/connections";
import { getSampleConnections } from "../data/connections";

type ConnectionsContextValue = {
  connections: DefinedConnection[];
  /** Returns the id of the new connection. */
  /** A template may also bring a description and ready tools. */
  addConnection: (input: { name: string; domain: string; type: ConnectionType; endpoint: string; description?: string; tools?: DefinedTool[] }) => string;
  updateConnection: (id: string, change: Partial<Omit<DefinedConnection, "id">>) => void;
  removeConnection: (id: string) => void;
};

const ConnectionsContext = createContext<ConnectionsContextValue | null>(null);

/**
 * Connections defined by the admin. They are loaded from the server store
 * (`/api/connections`) and every change is saved back after a short wait.
 * Keys are sent separately (`/api/connections/:id/key`) and never kept here.
 */
export function ConnectionsProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<DefinedConnection[]>(getSampleConnections);
  /** loaded: the server store answered, so changes are saved back. ready: show the page (with samples when there is no server). */
  const [loaded, setLoaded] = useState(false);
  // Without a server (the static site) the samples show at once instead of a blank page.
  const [ready, setReady] = useState(!hasServer);

  useEffect(() => {
    if (!hasServer) { setReady(true); return; }
    fetch("/api/admin/connections")
      .then((response) => { if (!response.ok) throw new Error(String(response.status)); return response.json() as Promise<{ connections: DefinedConnection[] }>; })
      .then((data) => { setConnections(data.connections); setLoaded(true); })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      void fetch("/api/admin/connections", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ connections }) }).catch(() => undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [loaded, connections]);

  const value = useMemo<ConnectionsContextValue>(
    () => ({
      connections,
      addConnection: ({ name, domain, type, endpoint, description = "", tools = [] }) => {
        const id = nextFreeId("conn-new", connections.map((item) => item.id));
        const ownTools = tools.map((tool, index) => ({ ...tool, id: `${id}-tool-${index + 1}` }));
        setConnections((list) => [...list, { id, name: name.trim(), domain: domain.trim(), description: description.trim(), type, endpoint: endpoint.trim(), auth: "shared-key", tools: ownTools, groupIds: [], active: false }]);
        return id;
      },
      updateConnection: (id, change) => setConnections((list) => list.map((item) => (item.id === id ? { ...item, ...change } : item))),
      removeConnection: (id) => setConnections((list) => list.filter((item) => item.id !== id)),
    }),
    [connections],
  );

  return <ConnectionsContext.Provider value={value}>{ready ? children : null}</ConnectionsContext.Provider>;
}

export function useConnections(): ConnectionsContextValue {
  const value = useContext(ConnectionsContext);
  if (!value) throw new Error("useConnections must be used inside ConnectionsProvider");
  return value;
}
