export type UsagePeriod = "daily" | "weekly" | "monthly";

export type UsageRow = { name: string; requests: number; tokens: number };

export type UsagePoint = { label: string; requests: number; tokens: number };

export type UsageReport = {
  series: UsagePoint[];
  byModel: UsageRow[];
  byAgent: UsageRow[];
};
