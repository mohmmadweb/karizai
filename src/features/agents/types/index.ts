export type ApprovalStatus = "approved" | "pending" | "rejected";

export type SkillContent = { name: string; description: string; instructions: string };

export type Skill = SkillContent & {
  id: string;
  approval: ApprovalStatus;
  rejectionReason?: string;
  /** An edit of an approved skill waits here; the approved version stays active. */
  pendingEdit?: SkillContent;
};

export type AgentToolRef = { connectionId: string; toolId: string };

export type ShareTarget = { kind: "user" | "group"; name: string };

export type ShareRequest = {
  id: string;
  targets: ShareTarget[];
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  /** ISO date. */
  requestedAt: string;
};

export type Agent = {
  id: string;
  name: string;
  purpose: string;
  instructions: string;
  defaultModelId: string;
  tools: AgentToolRef[];
  skillIds: string[];
  /** Set by the admin only. Forces an internal model. */
  isSensitive: boolean;
  isEnabled: boolean;
  disabledReason?: string;
  /** "personal" belongs to the user; "shared" was shared with them. */
  kind: "personal" | "shared";
  /** Built-in assistants: the document assistant and the data (business intelligence) assistant. */
  systemRole?: "document" | "bi";
  shareRequests: ShareRequest[];
  /** ISO date. */
  updatedAt: string;
  /** How many times the user called this Agent. */
  useCount: number;
};

export type AgentDraft = Pick<
  Agent,
  "name" | "purpose" | "instructions" | "defaultModelId" | "tools" | "skillIds"
>;

