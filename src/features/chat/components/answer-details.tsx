"use client";

import { useState } from "react";
import { ExternalLinkIcon, FileTextIcon, GlobeIcon, MessagesSquareIcon, ShieldCheckIcon, WrenchIcon } from "lucide-react";
import { ProviderLogo } from "@/components/shared/provider-logo";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Message, Source } from "../types";

/** Model, tools, and sources shown under an answer. */
export function AnswerDetails({ message }: { message: Message }) {
  const [opened, setOpened] = useState<Source | null>(null);
  const tools = [...new Set(message.toolNames ?? [])];
  return (
    <div className="flex flex-col gap-2 text-caption text-muted-foreground">
      <div className="flex flex-wrap items-center gap-2">
        {message.modelName ? <Badge variant="secondary"><ProviderLogo name={message.modelName} className="size-4 text-[9px]" />پاسخ از: {message.modelName}</Badge> : null}
        {message.agentName ? <Badge variant="info">Agent: {message.agentName}</Badge> : null}
        {tools.map((tool) => <Badge key={tool} variant="outline"><WrenchIcon aria-hidden />{tool}</Badge>)}
        {message.maskedCount ? <Badge variant="success"><ShieldCheckIcon aria-hidden />{message.maskedCount.toLocaleString("fa-IR")} مورد حساس پوشانده شد</Badge> : null}
      </div>
      {message.routerReason ? <p>{message.routerReason}</p> : null}
      {message.sources.length > 0 ? (
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <li>منبع‌ها:</li>
          {message.sources.map((source) => (
            <li key={source.id}>
              {source.kind === "web" ? (
                <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline-offset-4 hover:underline"><GlobeIcon className="size-3" aria-hidden />{source.title}<ExternalLinkIcon className="size-3" aria-hidden /></a>
              ) : (
                <button type="button" onClick={() => setOpened(source)} className="inline-flex items-center gap-1 underline-offset-4 hover:underline">{source.kind === "chat" ? <MessagesSquareIcon className="size-3" aria-hidden /> : <FileTextIcon className="size-3" aria-hidden />}{source.title}{source.section ? ` — ${source.section}` : ""}</button>
              )}
            </li>
          ))}
        </ul>
      ) : null}
      {message.notes?.map((note) => <p key={note}>{note}</p>)}
      <Dialog open={opened !== null} onOpenChange={(open) => !open && setOpened(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{opened?.title}</DialogTitle>
            <DialogDescription>{opened?.kind === "chat" ? `گفتگوی همکار: ${opened.section ?? ""}` : (opened?.section ?? "بخشی که پاسخ از آن آمده است")}</DialogDescription>
          </DialogHeader>
          <p className="rounded-lg bg-muted p-3 text-body">{opened?.excerpt ?? "بخشی از متن سند که در این پاسخ به آن ارجاع شده، اینجا نمایش داده می‌شود. فقط اسنادی نمایش داده می‌شوند که به آن‌ها دسترسی دارید."}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
