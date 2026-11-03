import type { AiModel } from "@/admin/features/models/types";
import { summarize } from "@/admin/features/usage-report/lib/aggregate";
import type { UsageRecord } from "@/admin/features/usage-report/types";
import { getPeriodFigures } from "../data/telemetry";
import type { ComponentHealth, DashboardPeriod, KeyFigures } from "../types";
import { countByStatus } from "./health";

/**
 * Key figures of the records already limited to the period. The error rate is
 * a fixed figure per period and the uptime drops by half a point for every
 * down component; real monitoring replaces both later.
 */
export function keyFigures(
  records: UsageRecord[],
  models: AiModel[],
  components: ComponentHealth[],
  period: DashboardPeriod,
): KeyFigures {
  const { totals } = summarize(records, models);
  const fixed = getPeriodFigures(period);
  const uptime = Math.max(90, fixed.baseUptime - countByStatus(components).down * 0.5);
  return {
    requests: totals.requests,
    activeUsers: new Set(records.map((r) => r.userId)).size,
    errorRate: fixed.errorRate,
    uptime: Math.round(uptime * 100) / 100,
    tokens: totals.inputTokens + totals.outputTokens,
    cost: totals.cost,
  };
}
