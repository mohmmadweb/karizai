import type { DefinedConnection } from "@/lib/connections";
import type { Policies, ToolMode } from "@/lib/policies";

export const hasWritingTool = (connection: DefinedConnection) => connection.tools.some((tool) => tool.writes);

/** Mode shown for a group and connection; missing means read and write. */
export const modeOf = (access: Policies["toolAccess"], groupId: string, connectionId: string): ToolMode =>
  access[groupId]?.[connectionId] ?? "readwrite";

/** Sets one mode; a read and write choice is dropped because it is the default. */
export function withMode(access: Policies["toolAccess"], groupId: string, connectionId: string, mode: ToolMode): Policies["toolAccess"] {
  const row = { ...(access[groupId] ?? {}) };
  if (mode === "readwrite") delete row[connectionId];
  else row[connectionId] = mode;
  const next = { ...access, [groupId]: row };
  if (Object.keys(row).length === 0) delete next[groupId];
  return next;
}
