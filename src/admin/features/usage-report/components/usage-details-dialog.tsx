"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatNumber, formatPercent } from "@/admin/lib/format";
import { formatCost } from "../lib/format-rows";
import type { Totals, UsageRow } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Name of the row, such as a user, a group or a day. */
  title: string;
  /** Short line under the title, such as the period. */
  subtitle: string;
  totals: Totals;
  /** One row per model, already sorted by usage. */
  models: UsageRow[];
};

const stat = (label: string, value: string) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-caption text-muted-foreground">{label}</dt>
    <dd className="text-body-sm font-medium tabular-nums">{value}</dd>
  </div>
);

/** Per-model usage behind one report row; its totals equal the row. */
export function UsageDetailsDialog({ open, onOpenChange, title, subtitle, totals, models }: Props) {
  const allTokens = totals.inputTokens + totals.outputTokens;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>جزئیات مصرف: {title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-4">
          {stat("درخواست‌ها", formatNumber(totals.requests))}
          {stat("توکن ورودی", formatNumber(totals.inputTokens))}
          {stat("توکن خروجی", formatNumber(totals.outputTokens))}
          {stat("هزینه‌ی تقریبی", formatCost(totals.cost))}
        </dl>
        {models.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">در این بازه مصرفی ثبت نشده است.</p>
        ) : (
          <ul className="flex flex-col gap-3" aria-label="مصرف به تفکیک مدل">
            {models.map((m) => {
              const share = allTokens > 0 ? (m.inputTokens + m.outputTokens) / allTokens : 0;
              return (
                <li key={m.id} className="flex flex-col gap-2 rounded-xl border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{m.name}</span>
                      {m.hint ? <Badge variant="outline">{m.hint}</Badge> : null}
                    </span>
                    <span className="text-body-sm tabular-nums text-muted-foreground">
                      سهم از توکن‌ها: {formatPercent(share)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(share * 100)}%` }} />
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                    {stat("درخواست‌ها", formatNumber(m.requests))}
                    {stat("توکن ورودی", formatNumber(m.inputTokens))}
                    {stat("توکن خروجی", formatNumber(m.outputTokens))}
                    {stat("هزینه‌ی تقریبی", formatCost(m.cost))}
                  </dl>
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
