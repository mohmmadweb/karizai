import type { Group } from "@/admin/features/user-management/types";
import type { UsageRow } from "../types";

export type AllowanceState = "within" | "near" | "used" | "none" | "unpriced";

export type AllowanceLine = {
  groupId: string;
  name: string;
  limit: number | null;
  used: number | null;
  remaining: number | null;
  /** 0 to 100, capped. */
  percent: number;
  state: AllowanceState;
};

export const stateLabels: Record<AllowanceState, string> = {
  within: "در حد",
  near: "نزدیک سقف",
  used: "سقف تمام شده",
  none: "بدون سقف",
  unpriced: "هزینه ثبت نشده",
};

/** One line per active group, from this week's cost rows and the weekly ceilings. */
export function buildAllowances(
  groups: Group[],
  weekRows: UsageRow[],
  limits: Record<string, number | null>,
): AllowanceLine[] {
  const costOf = new Map<string, number | null>(weekRows.map((r) => [r.id, r.cost]));
  return groups
    .filter((g) => g.status === "active")
    .map((g) => {
      const limit = limits[g.id] ?? null;
      const spent = costOf.has(g.id) ? costOf.get(g.id)! : 0;
      const base = { groupId: g.id, name: g.name, limit };
      if (limit === null) return { ...base, used: spent, remaining: null, percent: 0, state: "none" as const };
      if (spent === null) return { ...base, used: null, remaining: null, percent: 0, state: "unpriced" as const };
      const percent = Math.min(100, (spent / limit) * 100);
      const state = percent >= 100 ? "used" : percent >= 80 ? "near" : "within";
      return { ...base, used: spent, remaining: Math.max(0, limit - spent), percent, state };
    });
}
