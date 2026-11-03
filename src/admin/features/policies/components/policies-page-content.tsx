"use client";

import { useState } from "react";
import { MaskingPanel } from "@/admin/features/masking/components/masking-panel";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fallbackModelId, getDataSourceLevels, getPolicyModels } from "../data/policy-models";
import type { Sensitivity } from "../types";
import { BudgetsTab } from "./budgets-tab";
import { DocConfidentiality } from "./doc-confidentiality";
import { ExternalRequests } from "./external-requests";
import { GrantsTab } from "./grants-tab";
import { PolicyMatrix } from "./policy-matrix";
import { SourceLevels } from "./source-levels";

const tabs = [
  { id: "docs", label: "محرمانگی اسناد" },
  { id: "masking", label: "پوشاندن داده" },
  { id: "budgets", label: "بودجه تومانی گروه‌ها" },
  { id: "grants", label: "مجوز خواندن / نوشتن" },
  { id: "models", label: "سیاست مدل‌ها" },
  { id: "external", label: "درخواست‌های بیرونی" },
];

/**
 * «مرکز قواعد و سیاست‌ها»: every policy in one place. Documents, masking,
 * budgets and grants live in the shared policy store, so the user panel obeys
 * them in the same visit; the model matrix is local to this page.
 */
export function PoliciesPageContent() {
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
        title="مرکز قواعد و سیاست‌ها"
        description="همه‌ی قواعد هوش مصنوعی سازمان در یک جا: اسناد محرمانه، پوشاندن داده، بودجه‌ی گروه‌ها، مجوزها و مدل‌های مجاز. عامل‌ها نمی‌توانند این قواعد را دور بزنند."
      />
      <Tabs defaultValue="docs">
        <div className="overflow-x-auto">
          <TabsList aria-label="بخش‌های مرکز قواعد">
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="docs" className="pt-6"><DocConfidentiality /></TabsContent>
        <TabsContent value="masking" className="pt-6"><MaskingPanel /></TabsContent>
        <TabsContent value="budgets" className="pt-6"><BudgetsTab /></TabsContent>
        <TabsContent value="grants" className="pt-6"><GrantsTab /></TabsContent>
        <TabsContent value="models" className="flex flex-col gap-10 pt-6">
          <PolicyMatrix models={models} fallbackName={fallbackName} onToggle={toggle} onEnabledChange={setEnabled} />
          <SourceLevels sources={sources} models={models} onLevelChange={setLevel} />
        </TabsContent>
        <TabsContent value="external" className="pt-6"><ExternalRequests fallbackName={fallbackName} /></TabsContent>
      </Tabs>
    </div>
  );
}
