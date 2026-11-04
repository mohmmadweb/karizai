"use client";

import { BackLink } from "@/components/shared/back-link";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocuments } from "../../hooks/use-documents";
import { ConfidentialBadge, DocStatusBadge } from "../list/doc-badges";
import { InfoTab } from "./info-tab";
import { PipelineTab } from "./pipeline-tab";

export function DocumentDetail({ docId }: { docId: string }) {
  const { documents } = useDocuments();
  const doc = documents.find((d) => d.id === docId);

  if (!doc) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink href="/admin/documents">بازگشت به اسناد</BackLink>
        <EntityNotFound title="سند پیدا نشد" backHref="/admin/documents" backLabel="بازگشت به اسناد" />
      </div>
    );
  }

  // Processing progress must not reset unsaved edits, so only the editable fields key the form.
  const formKey = JSON.stringify([doc.name, doc.language, doc.confidential]);
  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/documents">بازگشت به اسناد</BackLink>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            {doc.name}
            <DocStatusBadge status={doc.status} />
            <ConfidentialBadge confidential={doc.confidential} />
          </span>
        }
        description={<bdi dir="ltr" className="uppercase">{doc.extension}</bdi>}
      />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">اطلاعات</TabsTrigger>
          <TabsTrigger value="pipeline">پردازش</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="pt-4"><InfoTab key={formKey} doc={doc} /></TabsContent>
        <TabsContent value="pipeline" className="pt-4"><PipelineTab doc={doc} /></TabsContent>
      </Tabs>
    </div>
  );
}
