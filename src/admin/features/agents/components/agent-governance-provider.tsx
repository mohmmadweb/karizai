"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useAgents } from "@/features/agents/components/agents-provider";
import type { Agent } from "@/features/agents/types";
import { getConnectionById } from "@/features/connections/data/connections";
import { agentMeta, getOfficialAgents, internalModelIds, writeToolKeys } from "../data/org-agents";
import type { AgentPatch, OrgAgent, ToolPolicy } from "../types";

type Value = { agents: OrgAgent[]; update: (id: string, patch: AgentPatch) => void };

const GovernanceContext = createContext<Value | null>(null);

function toOrgAgent(agent: Agent): OrgAgent {
  const meta = agentMeta[agent.id] ?? {};
  const tools = agent.tools.map((ref): ToolPolicy => {
    const connection = getConnectionById(ref.connectionId);
    const key = `${ref.connectionId}:${ref.toolId}`;
    const canWrite = writeToolKeys.has(key);
    return {
      key,
      name: connection?.tools.find((t) => t.id === ref.toolId)?.name ?? ref.toolId,
      connection: connection?.name ?? ref.connectionId,
      canWrite,
      mode: canWrite ? "readwrite" : "read",
      enabled: true,
    };
  });
  const sensitive = agent.isSensitive || agent.modelPolicy === "internal-only";
  return {
    id: agent.id,
    name: agent.name,
    purpose: agent.purpose,
    owner: meta.owner ?? (agent.kind === "personal" ? "مریم احمدی" : "واحد فناوری"),
    unit: meta.unit ?? "همه‌ی کارکنان",
    origin: agent.kind,
    status: !agent.isEnabled ? "disabled" : agent.shareRequests.some((s) => s.status === "pending") ? "pending" : "active",
    sensitive,
    tools,
    dataIds: meta.dataIds ?? [],
    modelIds: sensitive ? internalModelIds : [...internalModelIds, "pm-deepseek"],
    writeLimit: meta.writeLimit ?? (tools.some((t) => t.canWrite) ? { label: "سقف اقدام نوشتنی در روز", amount: null, unit: "اقدام" } : null),
  };
}

/** Admin powers over every Agent of the organization. Temporary: changes live only on this page visit. */
export function AgentGovernanceProvider({ children }: { children: ReactNode }) {
  const { agents } = useAgents();
  const [patches, setPatches] = useState<Record<string, AgentPatch>>({});
  const value = useMemo<Value>(() => {
    const base = [...agents.map(toOrgAgent), ...getOfficialAgents()];
    return {
      agents: base.map((a) => (patches[a.id] ? { ...a, ...patches[a.id] } : a)),
      update: (id, patch) => setPatches((all) => ({ ...all, [id]: patch })),
    };
  }, [agents, patches]);
  return <GovernanceContext.Provider value={value}>{children}</GovernanceContext.Provider>;
}

export function useOrgAgents(): Value {
  const value = useContext(GovernanceContext);
  if (!value) throw new Error("useOrgAgents must be used inside AgentGovernanceProvider");
  return value;
}
