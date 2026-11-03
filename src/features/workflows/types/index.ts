export type NodeKind =
  | "agent" | "skill" | "tool" | "condition" | "approval" | "orchestrator"
  /** Runs a short Python or JavaScript script. */
  | "code"
  /** Calls a registered machine-learning model; its numbers can feed a condition. */
  | "ml-model"
  | "prompt-optimizer"
  /** Smart router: sends the request to the best fitting Agent. */
  | "router"
  /** Supervisor: checks the output of the steps before it against rules. */
  | "supervisor"
  /** Parallel branch: every path that leaves it runs at the same time; `join` waits for all of them. */
  | "fork"
  | "join";

/** What a step does when it fails after its retries. branch: follow its «خطا» path. */
export type OnError = "stop" | "continue" | "branch";

export type CodeLanguage = "python" | "javascript";

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
  /** Code steps. */
  language?: CodeLanguage;
  code?: string;
  /** ML model steps: id from `getMlModels`. */
  mlModelId?: string;
  /** Supervisor steps: rules the output must meet. */
  checks?: string[];
  /** Error handling of any working step. */
  retries?: number;
  timeoutSec?: number;
  onError?: OnError;
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
  /** Condition nodes label their two paths; «خطا» marks the path taken when a step fails. */
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
  /** The step ran at the same time as another step of the run. */
  parallel?: boolean;
  /** Tries it took, when more than one. */
  attempts?: number;
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
  /** Time saved by running parallel branches at once instead of one after another. */
  savedMs?: number;
};

export type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  triggers: Trigger[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};
