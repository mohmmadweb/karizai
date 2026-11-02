"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenIcon, FileTextIcon, MessageSquareIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChat } from "@/features/chat/components/chat-provider";
import { formatDate } from "@/lib/format";
import type { KnowledgeDocument } from "../types";

type KnowledgePageContentProps = { documents: KnowledgeDocument[] };

export function KnowledgePageContent({ documents }: KnowledgePageContentProps) {
  const router = useRouter();
  const { setPrefill } = useChat();
  const [query, setQuery] = useState("");
  const filtered = documents.filter((doc) => `${doc.title} ${doc.source} ${doc.collection}`.includes(query.trim()));

  function startChat(doc: KnowledgeDocument) {
    setPrefill(`درباره‌ی سند «${doc.title}» برایم توضیح بده و نکته‌های مهمش را بگو.`);
    router.push("/chat");
  }

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="دانش سازمانی" description="اسناد و مجموعه‌هایی که به آن‌ها دسترسی دارید. افزودن و مدیریت اسناد در پنل ادمین انجام می‌شود." />
      <SearchField value={query} onValueChange={setQuery} label="جست‌وجو در اسناد" placeholder="جست‌وجو در اسناد" />
      {documents.length === 0 ? (
        <EmptyState icon={<BookOpenIcon />} title="سندی در دسترس نیست" description="هنوز به سندی دسترسی ندارید. با ادمین تماس بگیرید." />
      ) : filtered.length === 0 ? (
        <p className="py-6 text-center text-body text-muted-foreground">سندی پیدا نشد.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="flex items-start gap-2"><FileTextIcon className="mt-1 size-4 shrink-0" aria-hidden />{doc.title}</CardTitle>
                <CardDescription>منبع: {doc.source}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-body-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{doc.collection}</Badge>
                  {doc.updatedAt ? <span className="text-muted-foreground">آخرین به‌روزرسانی: {formatDate(doc.updatedAt)}</span> : null}
                </div>
                <Button size="sm" variant="outline" className="w-fit" onClick={() => startChat(doc)}><MessageSquareIcon aria-hidden />گفتگو درباره‌ی این سند</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
