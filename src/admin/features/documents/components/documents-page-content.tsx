"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfidentialityTab } from "./confidentiality-tab";
import { DocumentsTab } from "./list/documents-tab";
import { AddSourceDialog } from "./sources/add-source-dialog";
import { SourcesTab } from "./sources/sources-tab";
import { UploadDialog } from "./upload-dialog";

type Tab = "documents" | "sources" | "confidentiality";

export function DocumentsPageContent() {
  const [tab, setTab] = useState<Tab>("documents");
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);

  const action =
    tab === "documents" ? (
      <Button onClick={() => setUploading(true)}><PlusIcon aria-hidden />بارگذاری سند</Button>
    ) : tab === "sources" ? (
      <Button onClick={() => setAdding(true)}><PlusIcon aria-hidden />افزودن منبع</Button>
    ) : undefined;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="اسناد"
        description="اسناد سازمان، وضعیت پردازششان و محرمانگی‌شان؛ دسترسی هر گروه را از صفحه‌ی گروه تعیین می‌کنید."
        action={action}
      />
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="documents">اسناد</TabsTrigger>
          <TabsTrigger value="sources">منابع فایل‌سرور</TabsTrigger>
          <TabsTrigger value="confidentiality">محرمانگی</TabsTrigger>
        </TabsList>
        <TabsContent value="documents" className="pt-4"><DocumentsTab onUpload={() => setUploading(true)} /></TabsContent>
        <TabsContent value="sources" className="pt-4"><SourcesTab onAdd={() => setAdding(true)} /></TabsContent>
        <TabsContent value="confidentiality" className="pt-4"><ConfidentialityTab /></TabsContent>
      </Tabs>
      <UploadDialog open={uploading} onOpenChange={setUploading} />
      <AddSourceDialog open={adding} onOpenChange={setAdding} />
    </div>
  );
}
