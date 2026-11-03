import type { Bucket, ReportView, Totals, UsageRow } from "../types";
import type { ResolvedPeriod } from "../types";
import { hourLabel, dayLabel } from "./format-rows";

export const viewLabels: Record<ReportView, string> = {
  system: "کل سیستم",
  user: "کاربر",
  group: "گروه",
};

export const nameHeader: Record<ReportView, string> = {
  system: "دوره",
  user: "کاربر",
  group: "گروه",
};

/** System-view rows: one per hour or day. */
export function rowsFromBuckets(buckets: Bucket[], range: ResolvedPeriod): UsageRow[] {
  return buckets.map((b) => ({
    id: String(b.start),
    name: range.bucket === "hour" ? hourLabel(b.start) : dayLabel(b.start),
    requests: b.requests,
    inputTokens: b.inputTokens,
    outputTokens: b.outputTokens,
    cost: b.cost,
  }));
}

export const totalRow = (t: Totals): UsageRow => ({ id: "total", name: "جمع", ...t });
