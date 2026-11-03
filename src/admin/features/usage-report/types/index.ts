/** One answered request, as FR-QTA-08 describes it. */
export type UsageRecord = {
  id: string;
  userId: string;
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  /** ISO date string. */
  at: string;
};

export type PeriodId = "today" | "week" | "month" | "custom";

export type ReportView = "system" | "user" | "group";

export type Metric = "requests" | "tokens";

/** Custom range as `YYYY-MM-DD` strings; empty while not chosen. */
export type CustomRange = { from: string; to: string };

export type ResolvedPeriod = {
  /** Inclusive start, exclusive end, in epoch milliseconds (UTC). */
  from: number;
  to: number;
  bucket: "hour" | "day";
};

export type Totals = {
  requests: number;
  inputTokens: number;
  outputTokens: number;
  /** Sum of the priced records; null when no record has a recorded price. */
  cost: number | null;
};

export type UsageRow = Totals & {
  id: string;
  name: string;
  /** Extra line under the name, such as a provider. */
  hint?: string;
  inactive?: boolean;
};

export type Bucket = Totals & { start: number };
