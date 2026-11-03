import type { Agent } from "@/features/agents/types";
import type { Connection } from "@/features/connections/types";
import type { ScriptedEntry, ScriptedReply } from "../types";
import { getFixedConnectionReply } from "./connection-replies";
import { attachmentSummaryReply, qcSopSummaryReply } from "./scripted/documents";
import { knowledgeEntries } from "./scripted/knowledge";
import { maintenanceEntries } from "./scripted/maintenance";
import { pricingEntries } from "./scripted/pricing";
import { qualityEntries } from "./scripted/quality";
import { warehouseEntries } from "./scripted/warehouse";

const entries: ScriptedEntry[] = [...qualityEntries, ...maintenanceEntries, ...pricingEntries, ...warehouseEntries, ...knowledgeEntries];

export type CannedInput = {
  agent: Agent | null;
  connections: Pick<Connection, "id" | "name">[];
  knowledge: boolean;
  text: string;
  attachments?: { name: string }[];
};

/**
 * The prepared answer for what the user chose, if any. The Agent comes first, then the
 * selected connections, then organizational knowledge. A question that matches no entry
 * gets the fallback of the first scope that has one.
 */
export function findCannedReply({ agent, connections, knowledge, text, attachments = [] }: CannedInput): ScriptedReply | undefined {
  // «خلاصه‌ی این سند پیوست»: an attached file and a request to summarize it (or no text at all).
  const file = attachments[0];
  if (file && (!text.trim() || /(خلاصه|فایل‌های پیوست)/.test(text))) {
    return /QC-SOP-07/i.test(file.name) ? qcSopSummaryReply : attachmentSummaryReply(file.name);
  }
  const fixed = getFixedConnectionReply(connections);
  if (fixed && !agent) {
    return { fixed: true, steps: fixed.steps.map((step) => ({ ...step, kind: "tool" as const, via: `اتصال: ${fixed.connectionName}` })), text: fixed.text };
  }
  const applies = (entry: ScriptedEntry) =>
    (entry.scope.agentId !== undefined && entry.scope.agentId === agent?.id) ||
    (entry.scope.connectionId !== undefined && connections.some((item) => item.id === entry.scope.connectionId)) ||
    (entry.scope.knowledge === true && knowledge);
  const rank = (entry: ScriptedEntry) => (entry.scope.agentId ? 0 : entry.scope.connectionId ? 1 : 2);
  const scoped = entries.filter(applies).sort((a, b) => rank(a) - rank(b));
  return (scoped.find((entry) => entry.match?.test(text)) ?? scoped.find((entry) => !entry.match))?.reply;
}
