import type { AiModel } from "@/admin/features/models/types";
import type { UsageRecord } from "../types";

/** Cost of one record in tomans, or null when the model has no recorded prices. */
export function recordCost(record: UsageRecord, model: AiModel | undefined): number | null {
  if (!model || model.costInputPerMillion === null || model.costOutputPerMillion === null) {
    return null;
  }
  return (
    (record.inputTokens / 1_000_000) * model.costInputPerMillion +
    (record.outputTokens / 1_000_000) * model.costOutputPerMillion
  );
}

export const addCost = (total: number | null, part: number | null) =>
  part === null ? total : (total ?? 0) + part;
