"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyApiKeys } from "../data/api-keys";
import { ApiKeysTab } from "./api-keys-tab";
import { DesktopTab } from "./desktop-tab";
import { DocsTab } from "./docs-tab";
import { PlaygroundTab } from "./playground-tab";
import { SdkTab } from "./sdk-tab";

/** Personal API keys, the `/api/v1` reference, a playground, SDKs and the desktop app. Keys are temporary. */
export function DeveloperPageContent() {
  const [keys, setKeys] = useState(getMyApiKeys);
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="توسعه‌دهندگان و API" description="با کلید شخصی، مدل‌ها، عامل‌ها، دانش سازمانی و جریان‌ها را از برنامه‌های خودتان صدا بزنید. دسترسی هر کلید از دسترسی شما بیشتر نیست." />
      <Tabs defaultValue="keys">
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger value="keys" className="px-3">کلیدهای من</TabsTrigger>
            <TabsTrigger value="docs" className="px-3">مستندات</TabsTrigger>
            <TabsTrigger value="playground" className="px-3">آزمایشگاه (Playground)</TabsTrigger>
            <TabsTrigger value="sdk" className="px-3">SDK و نمونه‌کد</TabsTrigger>
            <TabsTrigger value="desktop" className="px-3">اپ دسکتاپ</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="keys" className="pt-4"><ApiKeysTab keys={keys} onKeysChange={setKeys} /></TabsContent>
        <TabsContent value="docs" className="pt-4"><DocsTab /></TabsContent>
        <TabsContent value="playground" className="pt-4"><PlaygroundTab keys={keys} /></TabsContent>
        <TabsContent value="sdk" className="pt-4"><SdkTab /></TabsContent>
        <TabsContent value="desktop" className="pt-4"><DesktopTab /></TabsContent>
      </Tabs>
    </div>
  );
}
