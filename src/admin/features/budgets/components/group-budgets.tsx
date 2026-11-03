"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePolicies, type GroupBudget } from "@/lib/policy-store";
import { formatNumber } from "@/admin/lib/format";
import { toman } from "../lib/forecast";
import { MeterBar } from "./meter-bar";

export const exhaustedLabels: Record<GroupBudget["onExhausted"], string> = {
  lock: "قفل",
  "internal-light": "تغییر به مدل سبک داخلی",
  notify: "هشدار به مدیر واحد",
};

/** Weekly group budgets, read from the policy center; they are edited there. */
export function GroupBudgets() {
  const { budgets } = usePolicies();
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>بودجه‌ی هفتگی گروه‌ها</CardTitle>
        <Link href="/admin/policies" className="text-body-sm text-primary underline-offset-4 hover:underline">ویرایش در مرکز قواعد و سیاست‌ها</Link>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 md:grid-cols-2">
          {budgets.map((b) => {
            const share = b.weeklyToman > 0 ? b.spentToman / b.weeklyToman : 0;
            return (
              <li key={b.groupId} className="flex flex-col gap-2 rounded-xl border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{b.groupName}</span>
                  <Badge variant={share >= 0.9 ? "warning" : "secondary"}>پس از اتمام: {exhaustedLabels[b.onExhausted]}</Badge>
                </div>
                <MeterBar value={b.spentToman} max={b.weeklyToman} label={`مصرف هفتگی ${b.groupName}`} />
                <p className="text-body-sm tabular-nums text-muted-foreground">{toman(b.spentToman)} از {toman(b.weeklyToman)} · {formatNumber(Math.round(share * 100))}٪</p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
