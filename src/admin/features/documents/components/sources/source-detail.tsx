"use client";

import { BackLink } from "@/components/shared/back-link";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocuments } from "../../hooks/use-documents";
import { protocolLabel } from "../../lib/selectors";
import { SourceAccessTab } from "./source-access-tab";
import { SourceTestBadge } from "./source-badges";
import { SourceInfoTab } from "./source-info-tab";

export function SourceDetail({ sourceId }: { sourceId: string }) {
  const { sources } = useDocuments();
  const source = sources.find((s) => s.id === sourceId);

  if (!source) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink href="/admin/documents">بازگشت به اسناد</BackLink>
        <EntityNotFound title="منبع پیدا نشد" backHref="/admin/documents" backLabel="بازگشت به اسناد" />
      </div>
    );
  }

  // Test results and sync figures must not reset unsaved edits.
  const formKey = JSON.stringify([source.name, source.protocol, source.host, source.port, source.folderPath, source.username]);
  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/documents">بازگشت به اسناد</BackLink>
      <PageHeader
        title={<span className="flex flex-wrap items-center gap-3">{source.name}<SourceTestBadge result={source.testResult} /></span>}
        description={<bdi dir="ltr">{protocolLabel[source.protocol]} · {source.host}{source.folderPath}</bdi>}
      />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">اطلاعات</TabsTrigger>
          <TabsTrigger value="access">دسترسی</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="pt-4"><SourceInfoTab key={formKey} source={source} /></TabsContent>
        <TabsContent value="access" className="pt-4"><SourceAccessTab source={source} /></TabsContent>
      </Tabs>
    </div>
  );
}
