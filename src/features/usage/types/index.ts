export type UsagePeriod = "daily" | "weekly" | "monthly";

/** `internal` decides the toman rate; an Agent row mixes both, so it carries its share of external tokens. */
export type UsageRow = { name: string; requests: number; tokens: number; internal?: boolean; externalShare?: number };

export type UsagePoint = { label: string; requests: number; tokens: number };

export type UsageReport = {
  series: UsagePoint[];
  byModel: UsageRow[];
  byAgent: UsageRow[];
};
