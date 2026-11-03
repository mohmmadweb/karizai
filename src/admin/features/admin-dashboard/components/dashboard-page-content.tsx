"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsageReportContent } from "@/admin/features/usage-report/components/usage-report-content";
import { DashboardContent as SystemTab } from "./dashboard-content";
import { UsageOverview } from "./usage-overview";

/** The one dashboard: usage and cost per group, the full usage report, and system health. */
export function DashboardPageContent() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="داشبورد" description="مصرف و هزینه‌ی هر گروه به تومان، سهمیه‌ی باقی‌مانده، گزارش مصرف و سلامت سامانه را یک‌جا ببینید." />
      <Tabs defaultValue="overview">
        <TabsList className="h-auto max-w-full flex-wrap justify-start">
          <TabsTrigger value="overview">نمای کلی</TabsTrigger>
          <TabsTrigger value="usage">گزارش مصرف</TabsTrigger>
          <TabsTrigger value="system">سلامت سامانه و مدل‌ها</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4"><UsageOverview /></TabsContent>
        <TabsContent value="usage" className="pt-4"><UsageReportContent /></TabsContent>
        <TabsContent value="system" className="pt-4"><SystemTab /></TabsContent>
      </Tabs>
    </div>
  );
}
