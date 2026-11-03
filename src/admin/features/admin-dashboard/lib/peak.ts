import type { UsageRecord } from "@/admin/features/usage-report/types";
import type { PeakHour } from "../types";
import { seed } from "./seed";

/**
 * Requests per hour of the day (UTC, as the usage report counts hours) and a
 * P95 time to first word that rises with the load of that hour.
 */
export function hourlyLoad(records: UsageRecord[]): PeakHour[] {
  const counts = Array.from({ length: 24 }, () => 0);
  for (const r of records) counts[new Date(r.at).getUTCHours()] += 1;
  const max = Math.max(1, ...counts);
  return counts.map((requests, hour) => ({
    hour,
    requests,
    ttftP95Ms: 1100 + Math.round((requests / max) * 2600) + (seed(`hour-${hour}`) % 300),
  }));
}

export function peakOf(hours: PeakHour[]) {
  const top = hours.reduce((best, h) => (h.requests > best.requests ? h : best), hours[0]);
  return top && top.requests > 0 ? top : null;
}
