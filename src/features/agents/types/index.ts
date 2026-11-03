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

/** Where an Agent can be called: the assistant (chat), a Kariz group, and workflows. */
export type AgentSurface = "assistant" | "group" | "workflows";

/** internal-only: only models on the organization's servers; auto: the router picks. */
export type ModelPolicy = "internal-only" | "auto";

/** One sample question of an evaluation set and the answer the Agent should give. */
export type EvalCase = { id: string; question: string; expected: string };

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
  /** Knowledge collections or folders the Agent answers from (ids from `getKnowledgeOptions`). */
  knowledgeIds?: string[];
  modelPolicy?: ModelPolicy;
  runIn?: AgentSurface[];
  /** «major.minor», raised by one minor step on every save. */
  version?: string;
  /** Share of the evaluation set answered correctly in the last run, 0..1. */
  evalScore?: number;
};

export type AgentDraft = Pick<
  Agent,
  "name" | "purpose" | "instructions" | "defaultModelId" | "tools" | "skillIds" | "knowledgeIds" | "modelPolicy" | "runIn" | "evalScore"
>;

