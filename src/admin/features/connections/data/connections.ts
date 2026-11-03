import { getUserConnections } from "@/features/connections/data/connections";
import type { ConnectionType, DefinedConnection } from "@/lib/connections";
import { getCollaborationConnections } from "./collaboration";
import { getConnectionTemplates } from "./templates";

/** Sample endpoints per system; addresses only, never secrets. */
const endpoints: Record<string, { type: ConnectionType; endpoint: string }> = {
  "conn-3": { type: "erp", endpoint: "https://erp.parsapolymer.local/rahkaran/api" },
};

/** The plant's SCADA, defined only in the admin panel from the OPC-UA template. */
function scadaSample(): DefinedConnection {
  const template = getConnectionTemplates().find((item) => item.type === "opcua")!;
  return {
    id: "conn-scada",
    name: template.name,
    domain: template.domain,
    description: template.description,
    type: template.type,
    endpoint: template.endpoint,
    auth: "shared-key",
    tools: template.tools.map((tool) => ({ ...tool, id: tool.id.replace("tpl-", "scada-") })),
    groupIds: ["group-003"],
    active: true,
  };
}

/**
 * Connections the admin sees when the server store is not available (for
 * example on the static demo). They mirror the systems shown in the user panel.
 */
export function getSampleConnections(): DefinedConnection[] {
  const mirrored = getUserConnections().map((connection, index): DefinedConnection => ({
    id: connection.id,
    name: connection.name,
    domain: connection.domain,
    description: connection.description,
    type: endpoints[connection.id]?.type ?? (index % 3 === 0 ? "mcp" : "api"),
    endpoint: endpoints[connection.id]?.endpoint ?? `https://mcp.parsapolymer.local/${connection.id}`,
    auth: connection.tools.some((tool) => tool.requiresApproval) ? "user-login" : "shared-key",
    tools: connection.tools.map(({ id, name, description, requiresApproval }) => ({ id, name, description, requiresApproval })),
    groupIds: ["group-001", "group-003"],
    active: true,
  }));
  const extras = getCollaborationConnections();
  const replaced = new Set(extras.map((item) => item.id));
  return [...mirrored.filter((item) => !replaced.has(item.id)), ...extras, scadaSample()];
}
