"use client";

import Link from "@/components/shared/app-link";
import { GroupAllowance } from "@/admin/features/usage-report/components/group-allowance";
import { useWeeklyAllowances } from "@/admin/features/usage-report/hooks/use-weekly-allowances";

/** Weekly group ceilings from the shared Policies with this week's spending; they are edited in the policy center. */
export function GroupBudgets() {
  const lines = useWeeklyAllowances();
  return (
    <section className="flex flex-col gap-3" aria-labelledby="group-budgets-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="group-budgets-title" className="text-h3">سقف هفتگی گروه‌ها</h2>
        <Link href="/admin/policies" className="rounded-sm text-body-sm text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">ویرایش در سیاست‌ها</Link>
      </div>
      <GroupAllowance lines={lines} />
    </section>
  );
}
