import type { AiModel, ModelProvider } from "@/admin/features/models/types";
import type { Group, Membership, User } from "@/admin/features/user-management/types";
import type { Bucket, ReportView, ResolvedPeriod, Totals, UsageRecord, UsageRow } from "../types";
import { agentOfRecord } from "../data/agents";
import { addCost, recordCost } from "./cost";
import { bucketStarts } from "./periods";

export type ReportContext = {
  users: User[];
  groups: Group[];
  memberships: Membership[];
  models: AiModel[];
  providers: ModelProvider[];
};

export const emptyTotals = (): Totals => ({
  requests: 0,
  inputTokens: 0,
  outputTokens: 0,
  cost: null,
});

/** Each sample record stands for a batch of requests, so token totals look plausible per request. */
export const REQUESTS_PER_RECORD = 120;

function addTo(total: Totals, record: UsageRecord, cost: number | null) {
  total.requests += REQUESTS_PER_RECORD;
  total.inputTokens += record.inputTokens;
  total.outputTokens += record.outputTokens;
  total.cost = addCost(total.cost, cost);
}

const modelMap = (models: AiModel[]) => new Map(models.map((m) => [m.id, m]));

export function inRange(records: UsageRecord[], range: ResolvedPeriod): UsageRecord[] {
  return records.filter((r) => {
    const t = Date.parse(r.at);
    return t >= range.from && t < range.to;
  });
}

/** Totals of the records, and the models that were used but have no recorded price. */
export function summarize(records: UsageRecord[], models: AiModel[]) {
  const byId = modelMap(models);
  const totals = emptyTotals();
  const unpriced = new Set<string>();
  for (const r of records) {
    const cost = recordCost(r, byId.get(r.modelId));
    if (cost === null) unpriced.add(r.modelId);
    addTo(totals, r, cost);
  }
  return { totals, unpricedModelIds: [...unpriced] };
}

/** One bucket per hour or day of the range, including empty ones. */
export function buckets(records: UsageRecord[], range: ResolvedPeriod, models: AiModel[]): Bucket[] {
  const byId = modelMap(models);
  const starts = bucketStarts(range);
  const step = range.bucket === "hour" ? 3_600_000 : 86_400_000;
  const list: Bucket[] = starts.map((start) => ({ start, ...emptyTotals() }));
  for (const r of records) {
    const index = Math.floor((Date.parse(r.at) - range.from) / step);
    if (index >= 0 && index < list.length) {
      addTo(list[index], r, recordCost(r, byId.get(r.modelId)));
    }
  }
  return list;
}

type Key = { id: string; name: string; hint?: string; inactive?: boolean };

function group(
  records: UsageRecord[],
  keysOf: (r: UsageRecord) => Key[],
  models: AiModel[],
): UsageRow[] {
  const byId = modelMap(models);
  const rows = new Map<string, UsageRow>();
  for (const r of records) {
    const cost = recordCost(r, byId.get(r.modelId));
    for (const key of keysOf(r)) {
      let row = rows.get(key.id);
      if (!row) {
        row = { ...emptyTotals(), ...key };
        rows.set(key.id, row);
      }
      addTo(row, r, cost);
    }
  }
  return [...rows.values()].sort(
    (a, b) => b.requests - a.requests || b.inputTokens + b.outputTokens - (a.inputTokens + a.outputTokens),
  );
}

export function rowsByUser(records: UsageRecord[], ctx: ReportContext): UsageRow[] {
  const users = new Map(ctx.users.map((u) => [u.id, u]));
  return group(
    records,
    (r) => {
      const u = users.get(r.userId);
      return [
        {
          id: r.userId,
          name: u?.name ?? "کاربر حذف‌شده",
          hint: u?.email,
          inactive: u?.status === "inactive",
        },
      ];
    },
    ctx.models,
  );
}

/** A user counts once for every group they belong to; users without a group go to «بدون گروه». */
export function rowsByGroup(records: UsageRecord[], ctx: ReportContext): UsageRow[] {
  const groups = new Map(ctx.groups.map((g) => [g.id, g]));
  return group(
    records,
    (r) => {
      const ids = ctx.memberships.filter((m) => m.userId === r.userId).map((m) => m.groupId);
      if (ids.length === 0) return [{ id: "no-group", name: "بدون گروه" }];
      return ids.map((id) => ({
        id,
        name: groups.get(id)?.name ?? "گروه حذف‌شده",
        inactive: groups.get(id)?.status === "inactive",
      }));
    },
    ctx.models,
  );
}

/** One row per agent; requests without an agent form the «گفتگوی مستقیم» row. */
export function rowsByAgent(records: UsageRecord[], ctx: ReportContext): UsageRow[] {
  return group(records, (r) => [agentOfRecord(r.id)], ctx.models);
}

export function rowsByModel(records: UsageRecord[], ctx: ReportContext): UsageRow[] {
  const models = new Map(ctx.models.map((m) => [m.id, m]));
  const providers = new Map(ctx.providers.map((p) => [p.id, p]));
  return group(
    records,
    (r) => {
      const m = models.get(r.modelId);
      return [
        {
          id: r.modelId,
          name: m?.displayName ?? "مدل حذف‌شده",
          hint: m ? providers.get(m.providerId)?.name : undefined,
        },
      ];
    },
    ctx.models,
  );
}

/** Rows whose name contains the typed text; Arabic letter forms match Persian ones. */
export function filterRows(rows: UsageRow[], query: string): UsageRow[] {
  const norm = (v: string) => v.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();
  const q = norm(query);
  if (!q) return rows;
  return rows.filter((r) => norm(r.name).includes(q));
}

/**
 * The records behind one table row. System rows are an hour or a day (the row
 * id is the bucket start), user rows one user, group rows the members of a group.
 */
export function recordsForRow(
  view: ReportView,
  rowId: string,
  records: UsageRecord[],
  ctx: ReportContext,
  range: ResolvedPeriod,
): UsageRecord[] {
  if (view === "user") return records.filter((r) => r.userId === rowId);
  if (view === "agent") return records.filter((r) => agentOfRecord(r.id).id === rowId);
  if (view === "group") {
    const inGroup = (userId: string) => {
      const groupIds = ctx.memberships.filter((m) => m.userId === userId).map((m) => m.groupId);
      return rowId === "no-group" ? groupIds.length === 0 : groupIds.includes(rowId);
    };
    return records.filter((r) => inGroup(r.userId));
  }
  if (view === "system") {
    const start = Number(rowId);
    const step = range.bucket === "hour" ? 3_600_000 : 86_400_000;
    return records.filter((r) => {
      const t = Date.parse(r.at);
      return t >= start && t < start + step;
    });
  }
  return [];
}

/**
 * Sample records name fixed model ids. When the registered models are other
 * ones, each unknown id is mapped onto one existing model (always the same
 * one), so the report keeps showing real names and prices. Not needed with
 * real usage data.
 */
export function bindToModels(records: UsageRecord[], models: AiModel[]): UsageRecord[] {
  if (models.length === 0) return records;
  const known = new Set(models.map((m) => m.id));
  const order = [...new Set(records.map((r) => r.modelId))].sort();
  const target = new Map(order.map((id, i) => [id, models[i % models.length].id]));
  return records.map((r) => (known.has(r.modelId) ? r : { ...r, modelId: target.get(r.modelId)! }));
}
