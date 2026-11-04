"use client";

import { CrownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toman } from "@/admin/features/budgets/lib/forecast";
import { formatNumber } from "@/admin/lib/format";
import { cn } from "@/lib/utils";
import type { Planned } from "../lib/plan";

const sec = (ms: number) => `${formatNumber(ms / 1000, { maximumFractionDigits: 1 })} ثانیه`;
const dash = <span className="text-muted-foreground">—</span>;

type Props = { rows: Planned[]; elapsed: number; estimates: Record<string, number>; winner: string | null };

/** Live table: each row fills in as its model streams, then the supervisor scores it. */
export function ResultsTable({ rows, elapsed, estimates, winner }: Props) {
  const done = (r: Planned) => elapsed >= r.e2eMs;
  const scored = (r: Planned) => elapsed >= r.e2eMs + 600;
  const best = (pick: (r: Planned) => number, low: boolean) => {
    const values = rows.map(pick);
    return low ? Math.min(...values) : Math.max(...values);
  };
  const all = rows.length > 0 && rows.every(scored);
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <Table aria-label="نتیجه‌ی آزمون مقایسه‌ای">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {["مدل", "برآورد مسیریاب", "TTFT", "E2E", "توکن", "هزینه", "امتیاز ناظر ✦"].map((h, i) => (
              <TableHead key={h} className={cn("h-11 px-4 text-label text-muted-foreground", i > 0 && "text-end")}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => {
            const started = elapsed >= r.ttftMs;
            const tokens = started ? Math.min(r.outputTokens, Math.round(((elapsed - r.ttftMs) / (r.e2eMs - r.ttftMs)) * r.outputTokens)) : 0;
            const isWinner = all && winner === r.modelId;
            return (
              <TableRow key={r.modelId} className={cn("h-14", isWinner && "bg-success/10 hover:bg-success/10")}>
                <TableCell className="px-4">
                  <span className="flex flex-wrap items-center gap-2 font-medium">
                    {r.name}
                    <Badge variant={r.internal ? "info" : "outline"}>{r.internal ? "داخلی" : "بیرونی"}</Badge>
                    {isWinner ? <Badge variant="success"><CrownIcon aria-hidden />بهترین انتخاب</Badge> : null}
                  </span>
                </TableCell>
                <TableCell className="px-4 text-end tabular-nums text-muted-foreground">{toman(estimates[r.modelId] ?? 0)}</TableCell>
                <TableCell className="px-4 text-end tabular-nums">{started ? <span className={cn(all && r.ttftMs === best((x) => x.ttftMs, true) && "font-semibold text-success")}>{sec(r.ttftMs)}</span> : <Spinner aria-label="در انتظار اولین توکن" />}</TableCell>
                <TableCell className="px-4 text-end tabular-nums">{done(r) ? <span className={cn(all && r.e2eMs === best((x) => x.e2eMs, true) && "font-semibold text-success")}>{sec(r.e2eMs)}</span> : started ? sec(elapsed) : dash}</TableCell>
                <TableCell className="px-4 text-end tabular-nums">{formatNumber(r.inputTokens)} + {formatNumber(tokens)}</TableCell>
                <TableCell className="px-4 text-end tabular-nums">{done(r) ? <span className={cn(all && r.cost === best((x) => x.cost, true) && "font-semibold text-success")}>{toman(r.cost)}</span> : dash}</TableCell>
                <TableCell className="px-4 text-end tabular-nums">{scored(r) ? <span className={cn(all && r.score === best((x) => x.score, false) && "font-semibold text-success")}>{formatNumber(r.score)} از ۱۰۰</span> : done(r) ? <span className="text-caption text-muted-foreground">ناظر در حال بررسی…</span> : dash}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
