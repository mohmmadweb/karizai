"use client";

import { ListSkeleton } from "@/components/shared/list-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiKeys } from "./api-keys-provider";
import { KeysSection } from "./keys-section";
import { PoliciesSection } from "./policies-section";

export function ApiKeysPageContent() {
  const { loaded } = useApiKeys();
  if (!loaded) return <ListSkeleton title="کلیدهای API" />;
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="کلیدهای API" description="تعیین کنید کدام گروه‌ها بتوانند برای مدل، عامل یا پایگاه دانش کلید API بسازند تا نرم‌افزارهای دیگر سازمان از موشکاف استفاده کنند، و کلیدهای ساخته‌شده را زیر نظر بگیرید." />
      <Tabs defaultValue="policies">
        <TabsList>
          <TabsTrigger value="policies">اجازه‌ی گروه‌ها</TabsTrigger>
          <TabsTrigger value="keys">کلیدها</TabsTrigger>
        </TabsList>
        <TabsContent value="policies" className="pt-4"><PoliciesSection /></TabsContent>
        <TabsContent value="keys" className="pt-4"><KeysSection /></TabsContent>
      </Tabs>
    </div>
  );
}
