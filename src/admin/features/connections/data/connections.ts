import { getUserConnections } from "@/features/connections/data/connections";
import type { ConnectionType, DefinedConnection } from "@/lib/connections";

/** Sample endpoints per system; addresses only, never secrets. */
const endpoints: Record<string, { type: ConnectionType; endpoint: string }> = {
  "conn-3": { type: "api", endpoint: "https://erp.parsapolymer.local/rahkaran/api" },
};

/**
 * Connections the admin sees when the server store is not available (for
 * example on the static demo). They mirror the systems shown in the user panel.
 */
export function getSampleConnections(): DefinedConnection[] {
  return getUserConnections().map((connection, index) => ({
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
}
