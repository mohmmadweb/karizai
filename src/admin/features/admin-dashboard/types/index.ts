export type HealthStatus = "healthy" | "slow" | "down" | "unknown";

export type ComponentGroupId =
  | "providers"
  | "selfHosted"
  | "tools"
  | "warehouse"
  | "fileServers"
  | "webSearch"
  | "internal";

export type ComponentHealth = {
  id: string;
  name: string;
  group: ComponentGroupId;
  status: HealthStatus;
  /** Milliseconds; null while the component is down or unknown. */
  medianMs: number | null;
  p95Ms: number | null;
  /** ISO date string of the last check. */
  checkedAt: string;
};

/** A seeded component that does not come from another section. */
export type ComponentSeed = {
  id: string;
  name: string;
  group: ComponentGroupId;
  status: HealthStatus;
  medianMs: number | null;
  p95Ms: number | null;
};

export type DashboardPeriod = "today" | "week" | "month";

export type Complexity = "simple" | "medium" | "complex";

export type Timing = { medianMs: number; p95Ms: number };

export type ModelSpeed = {
  modelId: string;
  name: string;
  providerName: string;
  selfHosted: boolean;
  ttft: Timing;
  tokensPerSecond: number;
  e2e: Record<Complexity, Timing>;
};

export type StepKind = "model" | "tool" | "api" | "warehouse" | "documents";

export type AgentStep = { id: string; name: string; kind: StepKind; ms: number };

export type AgentRun = { id: string; name: string; description: string; steps: AgentStep[] };

export type PeakHour = { hour: number; requests: number; ttftP95Ms: number };

export type Measure = { cost: number; tokens: number; accuracy: number; seconds: number };

export type ComparisonTask = { id: string; name: string; direct: Measure; multi: Measure };

export type ProviderCredit = {
  providerId: string;
  name: string;
  state: "available" | "unavailable" | "noCredit";
  purchasedTokens: number;
  reportedTokens: number;
  recordedTokens: number;
  /** Reported minus recorded, as a fraction of the recorded usage. */
  difference: number;
  matches: boolean;
  checkedAt: string;
};

export type AlertType = "down" | "ttft" | "e2e" | "errorRate";

export type DashboardAlert = {
  id: string;
  type: AlertType;
  component: string;
  /** Ready-to-show value, such as «۶٫۲ ثانیه» or «۷٪». */
  value: string;
  /** ISO date string. */
  at: string;
};

export type Thresholds = { ttftP95Sec: number; e2eP95Sec: number; errorRatePercent: number };

export type KeyFigures = {
  requests: number;
  activeUsers: number;
  errorRate: number;
  uptime: number;
  tokens: number;
  cost: number | null;
};
