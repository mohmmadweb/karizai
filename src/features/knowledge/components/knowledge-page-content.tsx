"use client";

import { useRouter } from "next/navigation";
import { BookOpenIcon, FolderIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { MotoPage, MotoPageHeader } from "@/components/shared/moto/moto";
import { Button } from "@/components/ui/button";
import { useChat } from "@/features/chat/components/chat-provider";
import { moistureQuestion } from "@/features/chat/data/scripted/knowledge";
import type { KnowledgeDocument } from "../types";
import { FileManager } from "./file-manager";

type KnowledgePageContentProps = { documents: KnowledgeDocument[] };

/** «مدیریت فایل‌ها»: the user's files with AI actions, the knowledge collections, and «✦ پرسش از کل دانش». */
export function KnowledgePageContent({ documents }: KnowledgePageContentProps) {
  const router = useRouter();
  const { updateSettings, setPrefill } = useChat();

  function askAll() {
    updateSettings(null, { knowledge: true, agentId: null });
    setPrefill(moistureQuestion);
    router.push("/chat");
  }

  if (documents.length === 0) {
    return (
      <MotoPage>
        <MotoPageHeader title="مدیریت فایل‌ها" icon={FolderIcon} action={<Button data-ai type="button" className="h-10" onClick={askAll}>✦ پرسش از کل دانش</Button>} />
        <EmptyState icon={<BookOpenIcon />} title="سندی در دسترس نیست" description="هنوز به سندی دسترسی ندارید. با ادمین تماس بگیرید." />
      </MotoPage>
    );
  }

  return (
    <>
      <FileManager initial={documents} onAskAll={askAll} />
      <p className="mx-auto w-full max-w-page page-gutter pb-8 text-caption text-muted-foreground">✦ فایل‌های این بخش با رعایت سطح دسترسی هر کاربر در دانش سازمانی نمایه می‌شوند؛ هر کس فقط از فایل‌هایی پاسخ می‌گیرد که می‌تواند باز کند.</p>
    </>
  );
}
