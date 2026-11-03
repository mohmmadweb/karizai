export type ConnectionStatus = "ready" | "needs-auth";

export type ToolParamKind = "text" | "textarea" | "url" | "secret" | "number" | "select";

/** One setting of a tool. A workflow step that uses the tool must fill every required one with a valid value. */
export type ToolParam = {
  key: string;
  label: string;
  kind: ToolParamKind;
  required: boolean;
  placeholder?: string;
  hint?: string;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
};

/** A value the tool returns; a workflow condition can compare it with a number. */
export type ToolOutput = { key: string; label: string; unit?: string };

export type ConnectionTool = {
  id: string;
  name: string;
  description: string;
  requiresApproval: boolean;
  /** False when the user's access was withdrawn after the connection was enabled. */
  userCanUse: boolean;
  /** Example inputs shown to the user before the tool runs. */
  sampleInputs: { label: string; value: string }[];
  /** Real settings of the tool; without them the sample inputs stand in as text settings. */
  params?: ToolParam[];
  outputs?: ToolOutput[];
};

/** A «درگاه»: one standard contract per kind of system; Kariz or the organization's own system plugs into it. */
export type GatewayId = "identity" | "documents" | "work" | "messaging" | "calendar" | "data" | "plant" | "other";

/** kariz: Kariz's own adapter; external: an adapter to the organization's system. */
export type AdapterKind = "kariz" | "external";

export type Connection = {
  id: string;
  name: string;
  /** Business area, for example "مدیریت ارتباط با مشتری CRM". */
  domain: string;
  description: string;
  /** Address of an imported workflow (n8n webhook). It is shown to the user and is not a secret. */
  endpoint?: string;
  status: ConnectionStatus;
  tools: ConnectionTool[];
  /** Gateway it plugs into; without it the gateway is found from the id or the area. */
  gateway?: GatewayId;
  adapter?: AdapterKind;
  /** Only reads; nothing in the system changes. */
  readOnly?: boolean;
};

export type ToolRunStatus =
  | "awaiting-approval"
  | "running"
  | "succeeded"
  | "failed"
  | "rejected";

export type ToolRun = {
  id: string;
  connectionId: string;
  toolId: string;
  toolName: string;
  description: string;
  inputs: { label: string; value: string }[];
  status: ToolRunStatus;
  result?: string;
  error?: string;
};
