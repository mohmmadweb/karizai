import type { AiModel } from "@/admin/features/models/types";
import type { Group, Membership, User } from "@/admin/features/user-management/types";
import { agentOfRecord } from "@/admin/features/usage-report/data/agents";
import { startOfDay } from "@/admin/features/usage-report/lib/periods";
import type { ResolvedPeriod, UsageRecord } from "@/admin/features/usage-report/types";
import { tomanPer1kTokens, type GroupBudget } from "@/lib/policy-store";

export type OverviewFilters = { userId: string; groupId: string };
export type OverviewRow = { id: string; name: string; tokens: number; requests: number; toman: number };
export type OverviewBucket = { start: number; tokens: number; toman: number };

export type Overview = {
  requests: number;
  tokens: number;
  toman: number;
  byGroup: OverviewRow[];
  topUsers: OverviewRow[];
  topAgents: OverviewRow[];
  buckets: OverviewBucket[];
};

type Context = { users: User[]; groups: Group[]; memberships: Membership[]; models: AiModel[] };

/** Cost of one record in toman: tokens at the internal or external rate of its model. */
export function recordToman(record: UsageRecord, model: AiModel | undefined): number {
  const rate = model?.selfHosted ? tomanPer1kTokens.internal : tomanPer1kTokens.external;
  return ((record.inputTokens + record.outputTokens) / 1000) * rate;
}

const NO_GROUP = { id: "no-group", name: "بدون گروه" };

function add(map: Map<string, OverviewRow>, key: { id: string; name: string }, tokens: number, toman: number) {
  const row = map.get(key.id) ?? { id: key.id, name: key.name, tokens: 0, requests: 0, toman: 0 };
  row.tokens += tokens;
  row.requests += 1;
  row.toman += toman;
  map.set(key.id, row);
}

const byToman = (a: OverviewRow, b: OverviewRow) => b.toman - a.toman;

export function buildOverview(
  records: UsageRecord[],
  ctx: Context,
  range: ResolvedPeriod,
  filters: OverviewFilters,
): Overview {
  const models = new Map(ctx.models.map((m) => [m.id, m]));
  const users = new Map(ctx.users.map((u) => [u.id, u]));
  const groups = new Map(ctx.groups.map((g) => [g.id, g]));
  const groupsOf = (userId: string) =>
    ctx.memberships.filter((m) => m.userId === userId).map((m) => m.groupId);

  const step = range.bucket === "hour" ? 3_600_000 : 86_400_000;
  const count = Math.ceil((range.to - startOfDay(range.from)) / step);
  const buckets: OverviewBucket[] = Array.from({ length: count }, (_, i) => ({
    start: range.from + i * step, tokens: 0, toman: 0,
  }));

  const byGroup = new Map<string, OverviewRow>();
  const byUser = new Map<string, OverviewRow>();
  const byAgent = new Map<string, OverviewRow>();
  const total = { requests: 0, tokens: 0, toman: 0 };

  for (const r of records) {
    if (filters.userId !== "all" && r.userId !== filters.userId) continue;
    const ids = groupsOf(r.userId);
    if (filters.groupId !== "all" && !ids.includes(filters.groupId)) continue;
    const tokens = r.inputTokens + r.outputTokens;
    const toman = recordToman(r, models.get(r.modelId));
    total.requests += 1;
    total.tokens += tokens;
    total.toman += toman;
    const keys = ids.length === 0 ? [NO_GROUP] : ids.map((id) => ({ id, name: groups.get(id)?.name ?? "گروه حذف‌شده" }));
    for (const key of keys) {
      if (filters.groupId === "all" || key.id === filters.groupId) add(byGroup, key, tokens, toman);
    }
    add(byUser, { id: r.userId, name: users.get(r.userId)?.name ?? "کاربر حذف‌شده" }, tokens, toman);
    add(byAgent, agentOfRecord(r.id), tokens, toman);
    const index = Math.floor((Date.parse(r.at) - range.from) / step);
    if (index >= 0 && index < buckets.length) {
      buckets[index].tokens += tokens;
      buckets[index].toman += toman;
    }
  }
  return {
    ...total,
    byGroup: [...byGroup.values()].sort(byToman),
    topUsers: [...byUser.values()].sort(byToman).slice(0, 5),
    topAgents: [...byAgent.values()].sort(byToman).slice(0, 5),
    buckets,
  };
}

/** Remaining weekly budget of a group, in toman and as tokens at the external rate. */
export function remainingOf(budget: GroupBudget) {
  const toman = Math.max(0, budget.weeklyToman - budget.spentToman);
  return {
    toman,
    tokens: Math.round((toman / tomanPer1kTokens.external) * 1000),
    spentFraction: budget.weeklyToman > 0 ? Math.min(1, budget.spentToman / budget.weeklyToman) : 0,
  };
}
