"use client";

import { useEffect, useRef, useState } from "react";
import { SendIcon } from "lucide-react";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBotById } from "../data/bots";
import { getColleagueById } from "../data/colleagues";
import { MessageItem } from "./message-item";
import { useMessenger } from "./messenger-provider";
import { ThreadAvatar } from "./thread-avatar";

/** A chat, like a messenger: the header with the picture, the messages, and a box to write. Bots only write to you, so they have no box. */
export function ThreadView({ threadId }: { threadId: string }) {
  const { messagesOf, markRead, send } = useMessenger();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLLIElement>(null);
  const bot = getBotById(threadId);
  const colleague = getColleagueById(threadId);
  const items = messagesOf(threadId);

  useEffect(() => { markRead(threadId); }, [threadId, items.length, markRead]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [threadId, items.length]);

  if (!bot && !colleague) return <EntityNotFound title="گفتگو پیدا نشد" backHref="/messenger" backLabel="بازگشت به پیام‌رسان" />;

  function submit() {
    const value = text.trim();
    if (!value) return;
    send(threadId, value);
    setText("");
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col">
      <header className="flex items-center gap-3 border-b bg-card page-gutter py-3">
        <ThreadAvatar threadId={threadId} className="size-11" />
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-h4">{bot?.name ?? colleague!.name}{bot ? <Badge variant="secondary">ربات</Badge> : null}</h1>
          <p className="truncate text-caption text-muted-foreground">{bot ? bot.description : `${colleague!.role} · ${colleague!.online ? "آنلاین" : "آفلاین"}`}</p>
        </div>
      </header>
      <ul className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-muted/40 page-gutter py-4" aria-label="پیام‌ها">
        {items.length === 0 ? <li className="py-10 text-center text-body text-muted-foreground">هنوز پیامی نیست.</li> : items.map((item) => <MessageItem key={item.id} message={item} />)}
        <li ref={endRef} aria-hidden />
      </ul>
      {bot ? (
        <p className="border-t bg-card page-gutter py-3 text-center text-body-sm text-muted-foreground">این ربات فقط برای شما پیام می‌فرستد.</p>
      ) : (
        <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex items-center gap-2 border-t bg-card page-gutter py-3">
          <Input value={text} onChange={(event) => setText(event.target.value)} aria-label={`پیام به ${colleague!.name}`} placeholder="پیام بنویسید..." autoComplete="off" />
          <Button type="submit" size="icon" aria-label="ارسال پیام" disabled={!text.trim()}><SendIcon aria-hidden className="rtl:-scale-x-100" /></Button>
        </form>
      )}
    </div>
  );
}
