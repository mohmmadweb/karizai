/**
 * Connections (اتصال‌ها) to the organization's systems. The admin panel defines
 * them; the user panel only shows and uses them. The same file lives in both
 * apps; keep the copies identical.
 */
export type ConnectionType = "mcp" | "api" | "n8n" | "dify" | "erp" | "opcua";

export const connectionTypeLabels: Record<ConnectionType, string> = {
  mcp: "سرور MCP",
  api: "API مستقیم",
  n8n: "فلوی n8n",
  dify: "اپ Dify",
  erp: "ERP (راهکاران و مانند آن)",
  opcua: "SCADA / OPC-UA",
};

/** Address scheme each type expects; OPC-UA servers use `opc.tcp://`, the rest web addresses. */
export const connectionEndpointHints: Record<ConnectionType, string> = {
  mcp: "https://",
  api: "https://",
  n8n: "https://",
  dify: "https://",
  erp: "https://",
  opcua: "opc.tcp://",
};

/** shared-key: one key kept by the server for everyone; user-login: each user signs in with their own account. */
export type ConnectionAuth = "none" | "shared-key" | "user-login";

export const connectionAuthLabels: Record<ConnectionAuth, string> = {
  none: "بدون احراز هویت",
  "shared-key": "کلید مشترک سازمان",
  "user-login": "ورود هر کاربر با حساب خودش",
};

export type DefinedTool = {
  id: string;
  name: string;
  description: string;
  /** The user must approve each run. */
  requiresApproval: boolean;
};

export type DefinedConnection = {
  id: string;
  name: string;
  /** Business area, for example «مدیریت ارتباط با مشتری CRM». */
  domain: string;
  description: string;
  type: ConnectionType;
  /** Address of the system. It is not a secret. */
  endpoint: string;
  auth: ConnectionAuth;
  tools: DefinedTool[];
  /** Groups that may use the connection. */
  groupIds: string[];
  active: boolean;
};
