"use client";

import { useState } from "react";
import { BackLink } from "@/components/shared/back-link";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataSources } from "../../hooks/use-data-sources";
import { databaseTypeLabel } from "../../lib/database-types";
import { ActiveBadge, TestResultBadge } from "../list/source-badges";
import { AccessTab } from "./access-tab";
import { InfoTab } from "./info-tab";
import { SchemasTab } from "./schemas-tab";
import { StructureTab } from "./structure-tab";

type Tab = "info" | "structure" | "schemas" | "access";

export function SourceDetail({ sourceId }: { sourceId: string }) {
  const { sources, descriptions } = useDataSources();
  const [tab, setTab] = useState<Tab>("info");
  const source = sources.find((s) => s.id === sourceId);

  if (!source) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink href="/admin/data">بازگشت به داده</BackLink>
        <EntityNotFound title="اتصال پیدا نشد" backHref="/admin/data" backLabel="بازگشت به داده" />
      </div>
    );
  }

  // Test result and activation must not reset unsaved edits, so they are left out of the key.
  const { testResult: _t, active: _a, ...editable } = source;
  void _t;
  void _a;

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/data">بازگشت به داده</BackLink>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            {source.name}
            <TestResultBadge result={source.testResult} />
            <ActiveBadge active={source.active} />
          </span>
        }
        description={<bdi dir="ltr">{databaseTypeLabel(source.type)}</bdi>}
      />
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="info">اطلاعات</TabsTrigger>
          <TabsTrigger value="structure">ساختار</TabsTrigger>
          <TabsTrigger value="schemas">اسکیماها و دسترسی</TabsTrigger>
          <TabsTrigger value="access">دسترسی</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="pt-4">
          <InfoTab key={JSON.stringify(editable)} source={source} />
        </TabsContent>
        <TabsContent value="structure" className="pt-4">
          <StructureTab
            key={JSON.stringify(descriptions[source.id] ?? {})}
            source={source}
            onGoToInfo={() => setTab("info")}
          />
        </TabsContent>
        <TabsContent value="schemas" className="pt-4">
          <SchemasTab source={source} onGoToInfo={() => setTab("info")} />
        </TabsContent>
        <TabsContent value="access" className="pt-4">
          <AccessTab source={source} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
