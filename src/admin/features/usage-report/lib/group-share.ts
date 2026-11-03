import type { UsageRow } from "../types";

export type ShareSlice = {
  id: string;
  name: string;
  tokens: number;
  cost: number | null;
  /** Share of the sum of all slices, 0 to 100. */
  percent: number;
  /** Chart token to paint with; the merged slice is neutral. */
  color: string;
};

const MAX_NAMED = 5;
const tokensOf = (row: UsageRow) => row.inputTokens + row.outputTokens;

/** Groups by tokens, largest first: the top five stay apart and the rest merge into «سایر». */
export function buildShare(rows: UsageRow[]): { slices: ShareSlice[]; all: ShareSlice[] } {
  const sorted = rows.filter((r) => tokensOf(r) > 0).sort((a, b) => tokensOf(b) - tokensOf(a));
  const sum = sorted.reduce((s, r) => s + tokensOf(r), 0);
  const make = (row: UsageRow, color: string): ShareSlice => ({
    id: row.id,
    name: row.name,
    tokens: tokensOf(row),
    cost: row.cost,
    percent: sum === 0 ? 0 : (tokensOf(row) / sum) * 100,
    color,
  });
  const all = sorted.map((row, i) => make(row, `var(--chart-${(i % MAX_NAMED) + 1})`));
  if (sorted.length <= MAX_NAMED) return { slices: all, all };
  const rest = sorted.slice(MAX_NAMED);
  const restTokens = rest.reduce((s, r) => s + tokensOf(r), 0);
  const costs = rest.map((r) => r.cost);
  const merged: ShareSlice = {
    id: "others",
    name: "سایر",
    tokens: restTokens,
    cost: costs.every((c) => c === null) ? null : costs.reduce<number>((s, c) => s + (c ?? 0), 0),
    percent: (restTokens / sum) * 100,
    color: "var(--muted-foreground)",
  };
  return { slices: [...all.slice(0, MAX_NAMED), merged], all };
}
