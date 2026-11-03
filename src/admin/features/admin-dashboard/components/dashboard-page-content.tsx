"use client";

import { PageHeader } from "@/components/shared/page-header";
import { UsageOverview } from "@/admin/features/usage-report/components/usage-overview";
import { DashboardContent as SystemHealth } from "./dashboard-content";

/** The one dashboard: usage of the groups, agents and people with their ceilings, then the health of the system. */
export function DashboardPageContent() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="داشبورد" description="مصرف و هزینه‌ی گروه‌ها، کاربران و عامل‌ها، سقف و باقی‌ماندهٔ هر گروه و وضعیت سامانه را یک‌جا ببینید." />
      <UsageOverview />
      <SystemHealth />
    </div>
  );
}
