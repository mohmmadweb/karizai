"use client";

import { hasServer } from "@/lib/static-params";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCurrentUser } from "@/features/user-session/data/session";
import type { DefinedConnection } from "@/lib/connections";
import { plantConnectionIds } from "../data/connections";
import type { Connection } from "../types";

type ConnectionsContextValue = {
  /** Connections open to the user's groups. The admin defines them; the user only uses them. */
  connections: Connection[];
  /** Connections the user can switch on (they may still need a sign-in). */
  available: Connection[];
  signIn: (id: string) => void;
};

const ConnectionsContext = createContext<ConnectionsContextValue | null>(null);

/** A connection of the admin's store, as the user panel shows it. */
function fromDefined(item: DefinedConnection): Connection {
  return {
    id: item.id,
    name: item.name,
    domain: item.domain,
    description: item.description,
    endpoint: item.endpoint,
    status: item.auth === "user-login" ? "needs-auth" : "ready",
    tools: item.tools.map((tool) => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      requiresApproval: tool.requiresApproval,
      userCanUse: true,
      sampleInputs: [{ label: "ورودی", value: "" }],
    })),
  };
}

/**
 * Connections of the user. They come from `/api/connections` (defined and
 * activated by the admin, filtered by the user's groups). Without any, the
 * sample list stays; the plant systems are always added.
 */
export function ConnectionsProvider({ initialConnections, children }: { initialConnections: Connection[]; children: ReactNode }) {
  const [defined, setDefined] = useState<Connection[] | null>(null);
  const [signedIn, setSignedIn] = useState<string[]>([]);

  useEffect(() => {
    const groupIds = getCurrentUser().groupIds;
    if (!hasServer) return;
    fetch("/api/connections")
      .then((response) => response.json() as Promise<{ connections: DefinedConnection[] }>)
      .then((data) => {
        const mine = data.connections.filter((item) => item.groupIds.some((id) => groupIds.includes(id))).map(fromDefined);
        if (mine.length > 0) setDefined(mine);
      })
      .catch(() => undefined);
  }, []);

  const value = useMemo<ConnectionsContextValue>(() => {
    const base = defined ? [...defined, ...initialConnections.filter((item) => plantConnectionIds.includes(item.id))] : initialConnections;
    const connections = base.map((item) => (signedIn.includes(item.id) ? { ...item, status: "ready" as const } : item));
    return { connections, available: connections, signIn: (id) => setSignedIn((list) => [...list, id]) };
  }, [defined, initialConnections, signedIn]);

  return <ConnectionsContext.Provider value={value}>{children}</ConnectionsContext.Provider>;
}

export function useConnections(): ConnectionsContextValue {
  const value = useContext(ConnectionsContext);
  if (!value) throw new Error("useConnections must be used inside ConnectionsProvider");
  return value;
}
