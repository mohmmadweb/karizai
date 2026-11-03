import type { Agent } from "@/features/agents/types";
import type { Connection } from "@/features/connections/types";
import { getCurrentUser } from "@/features/user-session/data/session";
import type { ScriptedEntry, ScriptedReply } from "../types";
import { getFixedConnectionReply } from "./connection-replies";
import { discountEntries } from "./scripted/discount";
import { knowledgeEntries } from "./scripted/knowledge";
import { maintenanceEntries } from "./scripted/maintenance";
import { pricingEntries } from "./scripted/pricing";
import { qualityEntries } from "./scripted/quality";
import { warehouseEntries } from "./scripted/warehouse";

const entries: ScriptedEntry[] = [...qualityEntries, ...maintenanceEntries, ...pricingEntries, ...warehouseEntries, ...discountEntries, ...knowledgeEntries];

export type CannedInput = {
  agent: Agent | null;
  connections: Pick<Connection, "id" | "name">[];
  knowledge: boolean;
  text: string;
};

/**
 * The prepared answer for what the user chose, if any. The Agent comes first, then the
 * selected connections, then organizational knowledge. A question that matches no entry
 * gets the fallback of the first scope that has one.
 */
export function findCannedReply({ agent, connections, knowledge, text }: CannedInput): ScriptedReply | undefined {
  const fixed = getFixedConnectionReply(connections);
  if (fixed && !agent) {
    return { fixed: true, steps: fixed.steps.map((step) => ({ ...step, kind: "tool" as const, via: `اتصال: ${fixed.connectionName}` })), text: fixed.text };
  }
  const groupIds = getCurrentUser().groupIds;
  const forMe = (entry: ScriptedEntry) =>
    (!entry.audience?.groups || entry.audience.groups.some((id) => groupIds.includes(id))) && !entry.audience?.exceptGroups?.some((id) => groupIds.includes(id));
  const applies = (entry: ScriptedEntry) =>
    forMe(entry) &&
    ((entry.scope.agentId !== undefined && entry.scope.agentId === agent?.id) ||
    (entry.scope.connectionId !== undefined && connections.some((item) => item.id === entry.scope.connectionId)) ||
    (entry.scope.knowledge === true && knowledge));
  const rank = (entry: ScriptedEntry) => (entry.scope.agentId ? 0 : entry.scope.connectionId ? 1 : 2);
  const scoped = entries.filter(applies).sort((a, b) => rank(a) - rank(b));
  return (scoped.find((entry) => entry.match?.test(text)) ?? scoped.find((entry) => !entry.match))?.reply;
}
