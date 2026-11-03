"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentsTab } from "./list/documents-tab";
import { AddSourceDialog } from "./sources/add-source-dialog";
import { SourcesTab } from "./sources/sources-tab";
import { UploadDialog } from "./upload-dialog";

type Tab = "documents" | "sources";

export function DocumentsPageContent() {
  const [tab, setTab] = useState<Tab>("documents");
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);

  const action =
    tab === "documents" ? (
      <Button onClick={() => setUploading(true)}><PlusIcon aria-hidden />بارگذاری سند</Button>
    ) : (
      <Button onClick={() => setAdding(true)}><PlusIcon aria-hidden />افزودن منبع</Button>
    );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="اسناد"
        description="اسناد سازمان، وضعیت پردازششان و اینکه چه کسانی به آن‌ها دسترسی دارند."
        action={action}
      />
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="documents">اسناد</TabsTrigger>
          <TabsTrigger value="sources">منابع فایل‌سرور</TabsTrigger>
        </TabsList>
        <TabsContent value="documents" className="pt-4"><DocumentsTab onUpload={() => setUploading(true)} /></TabsContent>
        <TabsContent value="sources" className="pt-4"><SourcesTab onAdd={() => setAdding(true)} /></TabsContent>
      </Tabs>
      <UploadDialog open={uploading} onOpenChange={setUploading} />
      <AddSourceDialog open={adding} onOpenChange={setAdding} />
    </div>
  );
}
