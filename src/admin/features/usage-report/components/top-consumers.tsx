import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/admin/lib/format";
import { formatCost } from "../lib/format-rows";
import type { UsageRow } from "../types";

const tokensOf = (row: UsageRow) => row.inputTokens + row.outputTokens;

/** The five rows with the most tokens, largest first. */
export const topFive = (rows: UsageRow[]) =>
  rows.filter((r) => tokensOf(r) > 0).sort((a, b) => tokensOf(b) - tokensOf(a)).slice(0, 5);

function RankList({ title, rows }: { title: string; rows: UsageRow[] }) {
  const max = Math.max(1, ...rows.map(tokensOf));
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {rows.length === 0 ? <p className="text-body-sm text-muted-foreground">مصرفی ثبت نشده.</p> : (
          <ol className="flex flex-col gap-3">
            {rows.map((r) => (
              <li key={r.id} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-3 text-body-sm">
                  <span className="min-w-0 truncate text-foreground">{r.name}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {formatNumber(tokensOf(r))} توکن · {formatCost(r.cost)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(tokensOf(r) / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

/** Top users and top agents of the chosen period, side by side. */
export function TopConsumers({ users, agents }: { users: UsageRow[]; agents: UsageRow[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <RankList title="پرمصرف‌ترین کاربران" rows={topFive(users)} />
      <RankList title="پرمصرف‌ترین عامل‌ها" rows={topFive(agents)} />
    </div>
  );
}
