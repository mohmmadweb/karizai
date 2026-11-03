/** One tool of an Agent as the admin allows it. */
export type ToolPolicy = {
  key: string;
  name: string;
  connection: string;
  /** False for tools that can only read; their mode is fixed to «read». */
  canWrite: boolean;
  mode: "read" | "readwrite";
  enabled: boolean;
};

/** Limit on write actions, for example the largest order amount the Agent may record. */
export type WriteLimit = { label: string; amount: number | null; unit: string };

export type OrgAgent = {
  id: string;
  name: string;
  purpose: string;
  owner: string;
  unit: string;
  origin: "personal" | "shared" | "official";
  status: "active" | "disabled" | "pending";
  /** Set by the admin only: only internal models, never an external one. */
  sensitive: boolean;
  tools: ToolPolicy[];
  /** Ids of data sources from the policy center. */
  dataIds: string[];
  /** Ids of policy models. */
  modelIds: string[];
  writeLimit: WriteLimit | null;
};

export type AgentPatch = Pick<OrgAgent, "sensitive" | "tools" | "dataIds" | "modelIds" | "writeLimit">;
