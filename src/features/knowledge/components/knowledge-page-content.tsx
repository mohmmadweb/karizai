"use client";

import { useRouter } from "next/navigation";
import { BookOpenIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChat } from "@/features/chat/components/chat-provider";
import { moistureQuestion } from "@/features/chat/data/scripted/knowledge";
import type { KnowledgeDocument } from "../types";
import { CollectionCards } from "./collection-cards";
import { FileManager } from "./file-manager";

type KnowledgePageContentProps = { documents: KnowledgeDocument[] };

/** «دانش سازمانی»: the user's files with AI actions, the knowledge collections, and «✦ پرسش از کل دانش». */
export function KnowledgePageContent({ documents }: KnowledgePageContentProps) {
  const router = useRouter();
  const { updateSettings, setPrefill } = useChat();

  function askAll() {
    updateSettings(null, { knowledge: true, agentId: null });
    setPrefill(moistureQuestion);
    router.push("/chat");
  }

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader
        title="دانش سازمانی"
        description="فایل‌ها و مجموعه‌هایی که به آن‌ها دسترسی دارید؛ دسترسی از سامانه‌ی مبدأ به ارث می‌رسد."
        action={<Button data-ai type="button" onClick={askAll}>✦ پرسش از کل دانش</Button>}
      />
      {documents.length === 0 ? (
        <EmptyState icon={<BookOpenIcon />} title="سندی در دسترس نیست" description="هنوز به سندی دسترسی ندارید. با ادمین تماس بگیرید." />
      ) : (
        <Tabs defaultValue="files">
          <TabsList>
            <TabsTrigger value="files">فایل‌ها</TabsTrigger>
            <TabsTrigger value="collections">مجموعه‌ها</TabsTrigger>
          </TabsList>
          <TabsContent value="files" className="pt-4"><FileManager initial={documents} /></TabsContent>
          <TabsContent value="collections" className="pt-4"><CollectionCards /></TabsContent>
        </Tabs>
      )}
      <p className="text-caption text-muted-foreground">✦ فایل‌های این بخش با رعایت سطح دسترسی هر کاربر در دانش سازمانی نمایه می‌شوند؛ هر کس فقط از فایل‌هایی پاسخ می‌گیرد که می‌تواند باز کند.</p>
    </div>
  );
}
