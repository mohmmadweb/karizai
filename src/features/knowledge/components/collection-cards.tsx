"use client";

import { ArchiveIcon, FileScanIcon, FolderIcon, MailIcon, MessagesSquareIcon, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAiPanel } from "@/features/ai-panel/components/ai-panel-provider";
import { formatNumber } from "@/lib/format";
import { getKnowledgeCollections } from "../data/collections";
import type { KnowledgeCollection } from "../types";

const icons: Record<KnowledgeCollection["icon"], LucideIcon> = { folder: FolderIcon, archive: ArchiveIcon, mail: MailIcon, chat: MessagesSquareIcon, scan: FileScanIcon };

/** The sources the organization's knowledge is built from, with document count, sync state and «✦ گفتگو درباره این مجموعه». */
export function CollectionCards() {
  const { openPanel } = useAiPanel();
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {getKnowledgeCollections().map((item) => {
        const Icon = icons[item.icon];
        return (
          <li key={item.id}>
            <Card className="h-full">
              <CardContent className="flex h-full flex-col gap-3">
                <Icon className="size-6 text-primary" aria-hidden />
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-label">{item.title}</h3>
                  <p className="text-caption text-muted-foreground">منبع: {item.source}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{item.countLabel}</Badge>
                  {item.sync.state === "synced"
                    ? <Badge variant="success">همگام{item.sync.ago ? ` · ${item.sync.ago}` : ""}</Badge>
                    : <Badge variant="warning">در حال پردازش {formatNumber(item.sync.percent)}٪</Badge>}
                </div>
                {item.sync.state === "processing" ? <Progress value={item.sync.percent} aria-label={`پیشرفت پردازش ${item.title}`} /> : null}
                <Button data-ai type="button" size="sm" variant="soft" className="mt-auto w-fit" onClick={() => openPanel({ context: item.title, question: `درباره‌ی مجموعه‌ی «${item.title}» توضیح بده`, answer: { text: item.answer, sources: [item.source] } })}>
                  ✦ گفتگو درباره این مجموعه
                </Button>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
