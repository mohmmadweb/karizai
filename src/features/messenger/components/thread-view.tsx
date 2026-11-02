"use client";

import { useEffect, useRef, useState } from "react";
import { BellRingIcon, SendIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { getColleagueById } from "../data/colleagues";
import { alertsThreadId } from "../types";
import { MessageItem } from "./message-item";
import { useMessenger } from "./messenger-provider";

/** The conversation with one colleague, or the workflow alerts. Own messages stay until the page is reloaded. */
export function ThreadView({ threadId }: { threadId: string }) {
  const { messagesOf, markRead, send } = useMessenger();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLLIElement>(null);
  const isAlerts = threadId === alertsThreadId;
  const colleague = getColleagueById(threadId);
  const items = messagesOf(threadId);

  useEffect(() => { markRead(threadId); }, [threadId, items.length, markRead]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [threadId, items.length]);

  if (!isAlerts && !colleague) return <EntityNotFound title="گفتگو پیدا نشد" backHref="/messenger" backLabel="بازگشت به پیام‌رسان" />;

  function submit() {
    const value = text.trim();
    if (!value) return;
    send(threadId, value);
    setText("");
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col">
      <header className="flex items-center gap-3 border-b page-gutter py-4">
        {isAlerts ? (
          <span aria-hidden className="flex size-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400"><BellRingIcon className="size-5" /></span>
        ) : (
          <Avatar className="size-10"><AvatarFallback>{colleague!.name.slice(0, 1)}</AvatarFallback></Avatar>
        )}
        <div>
          <h1 className="text-h3">{isAlerts ? "هشدارهای جریان‌ها" : colleague!.name}</h1>
          <p className="text-caption text-muted-foreground">{isAlerts ? "پیام‌هایی که جریان‌های شما برایتان می‌فرستند" : colleague!.role}</p>
        </div>
      </header>
      <ul className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto page-gutter py-4" aria-label="پیام‌ها">
        {items.length === 0 ? <li className="py-10 text-center text-body text-muted-foreground">هنوز پیامی نیست.</li> : items.map((item) => <MessageItem key={item.id} message={item} />)}
        <li ref={endRef} aria-hidden />
      </ul>
      {isAlerts ? null : (
        <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex items-center gap-2 border-t page-gutter py-3">
          <Input value={text} onChange={(event) => setText(event.target.value)} aria-label={`پیام به ${colleague!.name}`} placeholder="پیام بنویسید..." autoComplete="off" />
          <Button type="submit" size="icon" aria-label="ارسال پیام" disabled={!text.trim()}><SendIcon aria-hidden className="rtl:-scale-x-100" /></Button>
        </form>
      )}
    </div>
  );
}
