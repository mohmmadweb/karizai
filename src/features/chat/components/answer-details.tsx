"use client";

import { useState } from "react";
import { ExternalLinkIcon, FileTextIcon, GlobeIcon, LockIcon, MessagesSquareIcon, ShieldCheckIcon, WrenchIcon } from "lucide-react";
import { ProviderLogo } from "@/components/shared/provider-logo";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModels } from "@/features/model-catalog/components/models-provider";
import type { Message, Source } from "../types";
import { AnswerUsageBar } from "./answer-usage-bar";
import { OptimizationDetails } from "./optimization-details";

/** Model (internal, or external and masked), tools, sources, optimizer and usage shown under an answer. */
export function AnswerDetails({ message, question }: { message: Message; question: string }) {
  const [opened, setOpened] = useState<Source | null>(null);
  const { models } = useModels();
  // A name missing from the list (for example a removed real model) counts as external.
  const internal = Boolean(message.modelName && models.find((model) => model.name === message.modelName)?.isInternal);
  const tools = [...new Set(message.toolNames ?? [])];
  return (
    <div className="flex flex-col gap-2 text-caption text-muted-foreground">
      <div className="flex flex-wrap items-center gap-2">
        {message.modelName ? <Badge variant="secondary"><ProviderLogo name={message.modelName} className="size-4 text-[9px]" />پاسخ از: {message.modelName}</Badge> : null}
        {message.modelName ? (internal
          ? <Badge variant="success" data-ai><LockIcon aria-hidden />داخلی</Badge>
          : message.maskedCount ? <Badge variant="warning" data-ai><ShieldCheckIcon aria-hidden />بیرونی · پوشانده‌شده</Badge> : <Badge variant="outline"><GlobeIcon aria-hidden />بیرونی</Badge>) : null}
        {message.agentName ? <Badge variant="info">Agent: {message.agentName}</Badge> : null}
        {tools.map((tool) => <Badge key={tool} variant="outline"><WrenchIcon aria-hidden />{tool}</Badge>)}
        {message.maskedCount ? <Badge variant="success"><ShieldCheckIcon aria-hidden />{message.maskedCount.toLocaleString("fa-IR")} مورد حساس پوشانده شد</Badge> : null}
      </div>
      {message.routerReason ? <p>{message.routerReason}</p> : null}
      {message.optimization ? <OptimizationDetails item={message.optimization} /> : null}
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
      {message.status === "done" ? <AnswerUsageBar message={message} question={question} internal={internal} /> : null}
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
