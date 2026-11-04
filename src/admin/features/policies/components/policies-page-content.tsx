"use client";

import { useState } from "react";
import { CircleAlertIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fallbackModelId, getDataSourceLevels, getPolicyModels } from "../data/policy-models";
import type { Sensitivity } from "../types";
import { BudgetTab } from "./budget-tab";
import { ExternalRequests } from "./external-requests";
import { MaskingTab } from "./masking-tab";
import { usePolicies } from "./policies-provider";
import { PolicyMatrix } from "./policy-matrix";
import { SourceLevels } from "./source-levels";
import { ToolAccessTab } from "./tool-access-tab";

/**
 * «مرکز قواعد و سیاست‌ها»: group budgets, masking and read or
 * write access are the shared Policies (the user chat obeys them in the same
 * visit); the model matrix and the outside-request log are this page's own.
 */
export function PoliciesPageContent() {
  const { loading, loadError, reload } = usePolicies();
  const [models, setModels] = useState(getPolicyModels);
  const [sources, setSources] = useState(getDataSourceLevels);
  const fallbackName = models.find((m) => m.id === fallbackModelId)?.name ?? "مدل داخلی";

  const toggle = (id: string, level: Sensitivity) =>
    setModels((list) => list.map((m) => (m.id === id ? { ...m, allowed: { ...m.allowed, [level]: !m.allowed[level] } } : m)));
  const setEnabled = (id: string, enabled: boolean) =>
    setModels((list) => list.map((m) => (m.id === id ? { ...m, enabled } : m)));
  const setLevel = (id: string, level: Sensitivity) =>
    setSources((list) => list.map((s) => (s.id === id ? { ...s, level } : s)));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="سیاست‌ها"
        description="بودجه‌ی هر گروه، پنهان‌سازی فیلدهای حساس، دسترسی خواندن و نوشتن و مدل‌های مجاز را در یک جا تعیین کنید. محرمانگی اسناد در بخش «اسناد» است. عامل‌ها نمی‌توانند این قواعد را دور بزنند."
      />
      {loading ? (
        <div className="flex flex-col gap-3" aria-busy="true" aria-label="در حال بارگذاری سیاست‌ها">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : loadError ? (
        <Alert variant="destructive">
          <CircleAlertIcon aria-hidden />
          <AlertTitle>{loadError}</AlertTitle>
          <AlertDescription>اتصال به سرور برقرار نشد.</AlertDescription>
          <Button variant="outline" className="mt-2 w-fit" onClick={reload}>تلاش دوباره</Button>
        </Alert>
      ) : (
        <Tabs defaultValue="budget" className="min-w-0">
          <TabsList aria-label="بخش‌های سیاست‌ها" className="max-w-full justify-start overflow-x-auto">
            <TabsTrigger value="budget" className="shrink-0 flex-none px-3">بودجه‌ی گروه‌ها</TabsTrigger>
            <TabsTrigger value="masking" className="shrink-0 flex-none px-3">پنهان‌سازی</TabsTrigger>
            <TabsTrigger value="access" className="shrink-0 flex-none px-3">خواندن و نوشتن</TabsTrigger>
            <TabsTrigger value="models" className="shrink-0 flex-none px-3">سیاست مدل‌ها</TabsTrigger>
            <TabsTrigger value="external" className="shrink-0 flex-none px-3">درخواست‌های بیرونی</TabsTrigger>
          </TabsList>
          <TabsContent value="budget" className="pt-4"><BudgetTab /></TabsContent>
          <TabsContent value="masking" className="pt-4"><MaskingTab /></TabsContent>
          <TabsContent value="access" className="pt-4"><ToolAccessTab /></TabsContent>
          <TabsContent value="models" className="flex flex-col gap-10 pt-4">
            <PolicyMatrix models={models} fallbackName={fallbackName} onToggle={toggle} onEnabledChange={setEnabled} />
            <SourceLevels sources={sources} models={models} onLevelChange={setLevel} />
          </TabsContent>
          <TabsContent value="external" className="pt-4"><ExternalRequests fallbackName={fallbackName} /></TabsContent>
        </Tabs>
      )}
    </div>
  );
}
