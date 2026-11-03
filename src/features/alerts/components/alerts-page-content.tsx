"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsTab } from "./reports-tab";
import { RulesTab } from "./rules-tab";

export function AlertsPageContent() {
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="هشدارها و گزارش‌ها" description="مشخص کنید کدام داده زیرنظر باشد، هشدار برای چه کسی و با چه تناوبی برود، و گزارش‌های دوره‌ای چه زمانی ارسال شوند. هشدارهای رسیده را در پیام‌رسان «مهم» یا «بی‌اهمیت» علامت بزنید تا هشدار کاذب کم شود." />
      <Tabs defaultValue="rules">
        <TabsList><TabsTrigger value="rules">هشدارها</TabsTrigger><TabsTrigger value="reports">گزارش‌های زمان‌بندی‌شده</TabsTrigger></TabsList>
        <TabsContent value="rules" className="pt-4"><RulesTab /></TabsContent>
        <TabsContent value="reports" className="pt-4"><ReportsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
