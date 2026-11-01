export type NodeKind = "agent" | "skill" | "tool" | "condition" | "approval" | "orchestrator";

export type ConditionOperator = ">" | "<" | ">=" | "<=" | "=" | "!=";

/** A condition on a number that an earlier tool step returned. */
export type ConditionRule = { sourceNodeId: string; field: string; operator: ConditionOperator; value: string };

export type NodeConfig = {
  /** Settings of the step: the tool's own settings, or for an Agent step its input and token limit. */
  params?: Record<string, string>;
  /** Condition nodes: a comparison with a tool's output; without one, `condition` is a plain question. */
  rule?: ConditionRule;
  /** Agent nodes: the Agent that does this step. Skill nodes: the Agent the skill belongs to. */
  agentId?: string;
  /** Skill nodes: the skill the step applies. */
  skillId?: string;
  /** Tool nodes: the connection and tool that run. */
  connectionId?: string;
  toolId?: string;
  /** Agent, tool, and approval nodes: what the step should do, in plain words. */
  instruction?: string;
  /** Condition nodes: the question that picks the path («بله» or «خیر»). */
  condition?: string;
  /** Orchestrator nodes: Agents it may call, and the limits that stop endless loops. */
  childAgentIds?: string[];
  maxSteps?: number;
};

export type WorkflowNode = {
  id: string;
  kind: NodeKind;
  label: string;
  position: { x: number; y: number };
  config: NodeConfig;
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  /** Condition nodes label their two paths. */
  label?: string;
};

export type Weekday = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";

export type EventKind = "new-customer" | "new-email" | "indicator-breach" | "webhook";

export type Trigger =
  | { kind: "manual" }
  | { kind: "schedule"; every: "hourly" | "daily" | "weekly"; time: string; weekday?: Weekday }
  | { kind: "event"; event: EventKind };

/**
 * draft: not active yet. pending-approval: waits for the admin (schedule and
 * event triggers need it). active: runs by its triggers. paused: kept but off.
 */
export type WorkflowStatus = "draft" | "pending-approval" | "active" | "paused";

export type Workflow = {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  triggers: Trigger[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  /** ISO date strings. */
  updatedAt: string;
  lastRunAt?: string;
};

export type RunStatus = "running" | "waiting-approval" | "succeeded" | "failed";

export type StepStatus = "pending" | "running" | "waiting-approval" | "succeeded" | "failed" | "skipped";

export type RunStep = {
  nodeId: string;
  label: string;
  status: StepStatus;
  durationMs?: number;
  /** Model that did the step, for steps made by a model. */
  modelName?: string;
  /** Tokens spent by the step; absent for steps that use no model. */
  inputTokens?: number;
  outputTokens?: number;
  output?: string;
  error?: string;
};

export type Run = {
  id: string;
  workflowId: string;
  /** ISO date strings. */
  startedAt: string;
  endedAt?: string;
  status: RunStatus;
  /** What started it, for example «دستی» or «زمان‌بندی: هر شنبه ۰۸:۰۰». */
  startedBy: string;
  steps: RunStep[];
};

export type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  triggers: Trigger[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};
