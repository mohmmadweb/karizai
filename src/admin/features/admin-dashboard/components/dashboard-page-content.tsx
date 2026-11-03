"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlarmsTab } from "@/admin/features/bi-dashboard/components/alarms-tab";
import { AreasTab } from "@/admin/features/bi-dashboard/components/areas-tab";
import { DashboardTab as LimitsTab } from "@/admin/features/bi-dashboard/components/dashboard-tab";
import { IndicatorsTab } from "@/admin/features/bi-dashboard/components/indicators-tab";
import { DashboardContent as SystemTab } from "./dashboard-content";

/** The one dashboard: business areas, indicators with limits, alarms, and the health of the system. */
export function DashboardPageContent() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="داشبورد" description="وضعیت ۱۳ حوزه‌ی سازمان، شاخص‌های دارای حد مجاز، هشدارها و سلامت سامانه را یک‌جا ببینید." />
      <Tabs defaultValue="areas">
        <TabsList className="h-auto max-w-full flex-wrap justify-start">
          <TabsTrigger value="areas">نمای کلی سازمان</TabsTrigger>
          <TabsTrigger value="limits">پایش شاخص‌ها</TabsTrigger>
          <TabsTrigger value="alarms">هشدارها</TabsTrigger>
          <TabsTrigger value="indicators">تعریف شاخص‌ها</TabsTrigger>
          <TabsTrigger value="system">سامانه و مدل‌ها</TabsTrigger>
        </TabsList>
        <TabsContent value="areas" className="pt-4"><AreasTab /></TabsContent>
        <TabsContent value="limits" className="pt-4"><LimitsTab /></TabsContent>
        <TabsContent value="alarms" className="pt-4"><AlarmsTab /></TabsContent>
        <TabsContent value="indicators" className="pt-4"><IndicatorsTab /></TabsContent>
        <TabsContent value="system" className="pt-4"><SystemTab /></TabsContent>
      </Tabs>
    </div>
  );
}
