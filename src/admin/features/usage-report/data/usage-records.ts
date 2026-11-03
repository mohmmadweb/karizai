import type { UsageRecord } from "../types";

/**
 * The «now» of the sample data. A fixed instant keeps server and browser
 * output equal; it is replaced by the real clock with real data.
 */
export function getReportNow(): string {
  return "2026-10-18T14:30:00.000Z";
}

const DAY = 86_400_000;

/** Small seeded generator so the sample data is the same on every run. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const users = [
  { id: "user-002", weight: 5 },
  { id: "user-003", weight: 4 },
  { id: "user-004", weight: 2 },
  { id: "user-005", weight: 2 },
  { id: "user-006", weight: 3 },
  { id: "user-007", weight: 3 },
  { id: "user-008", weight: 1 },
];

// Each record is one work session of a user (many requests), so weekly costs reach the
// million-toman group ceilings set in «سیاست‌ها».
const models = [
  { id: "model-001", weight: 5, size: 225_000 },
  { id: "model-002", weight: 3, size: 350_000 },
  { id: "model-004", weight: 4, size: 175_000 },
  { id: "model-005", weight: 2, size: 100_000 },
  { id: "model-006", weight: 1, size: 150_000 },
];

function pick<T extends { weight: number }>(items: T[], r: number): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  let point = r * total;
  for (const item of items) {
    point -= item.weight;
    if (point <= 0) return item;
  }
  return items[items.length - 1];
}

function generate(): UsageRecord[] {
  const next = seeded(20261018);
  const now = new Date(getReportNow()).getTime();
  const midnight = now - (now % DAY);
  const records: UsageRecord[] = [];
  for (let d = 0; d < 60; d++) {
    const dayStart = midnight - d * DAY;
    const count = 7 + Math.floor(next() * 10);
    for (let i = 0; i < count; i++) {
      // user-005 is inactive now and only has older usage.
      const pool = d < 20 ? users.filter((u) => u.id !== "user-005") : users;
      const user = pick(pool, next());
      const model = pick(models, next());
      const hour = 7 + Math.floor(next() * 11);
      const at = dayStart + hour * 3_600_000 + Math.floor(next() * 3_600_000);
      // The first day only has records before the mock «now».
      if (d === 0 && at > now) continue;
      const input = Math.round(model.size * (0.5 + next()));
      const output = Math.round(model.size * (0.3 + next() * 0.8));
      records.push({
        id: `usage-${String(records.length + 1).padStart(4, "0")}`,
        userId: user.id,
        modelId: model.id,
        inputTokens: input,
        outputTokens: output,
        at: new Date(at).toISOString(),
      });
    }
  }
  return records;
}

let cache: UsageRecord[] | null = null;

export function getUsageRecords(): UsageRecord[] {
  cache ??= generate();
  return cache;
}
