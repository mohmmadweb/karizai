import type { ConnectionType } from "@/lib/connections";

export function isHttpAddress(value: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(value.trim()).protocol);
  } catch {
    return false;
  }
}

/** OPC-UA servers are reached with `opc.tcp://host:port`; every other type with a web address. */
export function isValidEndpoint(type: ConnectionType, value: string): boolean {
  if (type !== "opcua") return isHttpAddress(value);
  return /^opc\.tcp:\/\/[^\s/:]+(:\d{2,5})?(\/\S*)?$/i.test(value.trim());
}

export function endpointError(type: ConnectionType): string {
  return type === "opcua" ? "نشانی سرور OPC-UA باید با opc.tcp:// شروع شود." : "نشانی باید با http یا https شروع شود.";
}
