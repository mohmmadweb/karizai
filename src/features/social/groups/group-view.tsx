"use client";

import { useState } from "react";
import { BotIcon, SendIcon } from "lucide-react";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currentUserId, personName } from "@/features/workspace/lib/people";
import { AlertCard } from "@/features/messenger/components/message-item";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AiAnswer } from "../components/ai-answer";
import { AiButton } from "../components/ai-button";
import { SourceChips } from "../components/ai-parts";
import { getAgentMember } from "../data/agents";
import { formatTime } from "../lib/jalali";
import type { Group, GroupMessage } from "../types";
import { GroupSummaryAnswer } from "./group-summary-answer";

type GroupViewProps = { group: Group; messages: GroupMessage[]; onSend: (text: string) => void; onAddAgent: () => void };

/** One group: header, the assistant's unread digest, the messages (Agents answer with sources) and the message box. */
export function GroupView({ group, messages, onSend, onAddAgent }: GroupViewProps) {
  const [text, setText] = useState("");
  const [summaryKey, setSummaryKey] = useState<number | null>(null);
  const { summary } = group;
  const agentNames = group.agentIds.map((id) => getAgentMember(id)?.handle).filter(Boolean).join("، ");
  return (
    <section aria-label={group.name} className="flex min-w-0 flex-col gap-4 rounded-2xl border bg-card p-4">
      <header className="flex flex-wrap items-center gap-3 border-b pb-3">
        <span aria-hidden className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-h4 text-primary">{group.name[0]}</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-h4">{group.name}</h2>
          <p className="text-caption text-muted-foreground">{formatNumber(group.memberCount)} عضو · {formatNumber(group.agentIds.length)} عامل هوشمند{agentNames ? ` (${agentNames})` : ""}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onAddAgent}><BotIcon aria-hidden />افزودن عامل به گروه</Button>
        <AiButton label="خلاصه‌ی خوانده‌نشده‌ها" onClick={() => setSummaryKey(Date.now())} />
      </header>
      {summaryKey ? <AiAnswer key={summaryKey}><GroupSummaryAnswer group={group} /></AiAnswer> : summary.unread > 0 ? (
        <button type="button" onClick={() => setSummaryKey(Date.now())} className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <span className="block text-label text-primary">✦ {formatNumber(summary.unread)} پیام خوانده‌نشده</span>
          <span className="text-body-sm">موضوع اصلی: {summary.topic} · ۱ تصمیم باز · {formatNumber(summary.actions.length)} اقدام پیشنهادی</span>
        </button>
      ) : null}
      <ul className="flex flex-col gap-3" aria-label="پیام‌ها">
        {messages.length === 0 ? <li className="py-6 text-center text-body-sm text-muted-foreground">هنوز پیامی نیست.</li> : null}
        {messages.map((message) => {
          const agent = getAgentMember(message.authorId);
          const mine = message.authorId === currentUserId();
          if (message.system) return <li key={message.id} className="text-center text-caption text-muted-foreground">{message.text}</li>;
          if (message.alert) return (
            <li key={message.id} className="flex flex-col items-end gap-1">
              <span className="text-caption text-muted-foreground">✦ جریان‌ها · {formatTime(message.createdAt)}</span>
              <AlertCard id={message.id} alert={message.alert} text={message.text} />
            </li>
          );
          return (
            <li key={message.id} className={cn("flex items-end gap-2", mine && "flex-row-reverse")}>
              {agent ? <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">✦</span> : <PersonAvatar seed={message.authorId} name={personName(message.authorId)} className="size-8" />}
              <div className={cn("flex max-w-[85%] flex-col gap-1.5 rounded-2xl px-4 py-2", agent ? "border border-primary/20 bg-primary/5" : mine ? "bg-primary text-primary-foreground" : "bg-muted")}>
                <span className={cn("text-caption font-medium", agent ? "text-primary" : "opacity-80")}>{agent ? `✦ ${agent.name}` : mine ? "شما" : personName(message.authorId)} · {formatTime(message.createdAt)}</span>
                <p className="whitespace-pre-wrap text-body">{message.text}</p>
                {message.sources ? <SourceChips sources={message.sources} /> : null}
              </div>
            </li>
          );
        })}
      </ul>
      <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onSend(text.trim()); setText(""); } }} className="flex items-center gap-2 border-t pt-3">
        <Input value={text} onChange={(e) => setText(e.target.value)} aria-label={`پیام به گروه ${group.name}`} placeholder={`پیام... (${agentNames || "@دستیار کیفیت"} برای صدا زدن عامل)`} autoComplete="off" />
        <Button type="submit" size="icon" aria-label="ارسال پیام" disabled={!text.trim()}><SendIcon aria-hidden className="rtl:-scale-x-100" /></Button>
      </form>
    </section>
  );
}
