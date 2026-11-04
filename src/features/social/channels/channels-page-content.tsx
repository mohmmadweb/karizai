"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { MegaphoneIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMessenger } from "@/features/messenger/components/messenger-provider";
import { getCurrentUser } from "@/features/user-session/data/session";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AiAction } from "../components/ai-dialog";
import { announcementDrafts, getChannelPosts, getChannels } from "../data/channels";
import { formatDay, formatTime } from "../lib/jalali";
import type { Channel, ChannelPost } from "../types";

/** «کانال‌ها»: one-way channels; «هشدارهای تولید» is written by alert rules and Agents. Posts stay until reload. */
export function ChannelsPageContent() {
  const [channels, setChannels] = useState(getChannels);
  const [posts, setPosts] = useState(getChannelPosts);
  // `?id=` (from the chat list or the sidebar) opens that channel.
  const requested = useSearchParams().get("id");
  const [selectedId, setSelectedId] = useState(() => (requested && channels.some((c) => c.id === requested) ? requested : "ch-alerts"));
  const [seenRequest, setSeenRequest] = useState(requested);
  if (requested !== seenRequest) {
    setSeenRequest(requested);
    if (requested && channels.some((c) => c.id === requested)) setSelectedId(requested);
  }
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const counter = useRef(0);
  const selected = channels.find((c) => c.id === selectedId) ?? channels[0];
  // What workflows published in the channel during this visit, for example the production plan in «هشدارهای تولید».
  const { messagesOf, markRead } = useMessenger();
  const fromFlows: ChannelPost[] = messagesOf(selected.id).map((item) => ({
    id: item.id, channelId: selected.id, author: item.sender ?? "جریان‌ها", createdAt: item.createdAt, text: item.text,
    automatic: { href: item.alert?.workflowId ? `/workflows/${item.alert.workflowId}` : "/workflows", label: item.sender ?? "جریان‌ها" },
  }));
  useEffect(() => { markRead(selected.id); }, [selected.id, fromFlows.length, markRead]);
  const shown = [...posts.filter((p) => p.channelId === selected.id), ...fromFlows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const publish = (text: string) => { setPosts((list) => [...list, { id: `cp-new-${++counter.current}`, channelId: selected.id, author: getCurrentUser().name, createdAt: new Date().toISOString(), text }]); toast.success(`در کانال «${selected.name}» منتشر شد`); };

  function create(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    const channel: Channel = { id: `ch-new-${++counter.current}`, name: name.trim(), description: "کانال تازه", memberCount: 1, publisher: getCurrentUser().name };
    setChannels((list) => [...list, channel]); setSelectedId(channel.id); setName(""); setCreating(false);
    toast.success(`کانال «${channel.name}» ساخته شد`);
  }

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="کانال‌ها" description="اطلاع‌رسانی یک‌طرفه به همکاران؛ عامل‌ها و جریان‌ها هم می‌توانند منتشر کنند." action={<Button onClick={() => setCreating(true)}><PlusIcon data-icon="inline-start" aria-hidden />ایجاد کانال</Button>} />
      <ul className="grid gap-3 md:grid-cols-3" aria-label="فهرست کانال‌ها">
        {channels.map((c) => (
          <li key={c.id}>
            <button type="button" aria-current={c.id === selected.id ? "true" : undefined} onClick={() => setSelectedId(c.id)} className={cn("flex h-full w-full flex-col gap-1 rounded-xl border bg-card p-4 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50", c.id === selected.id && "border-primary ring-1 ring-primary/30")}>
              <span className="flex items-center gap-2 text-label"><MegaphoneIcon className="size-4 text-primary" aria-hidden />{c.name}</span>
              <span className="text-caption text-muted-foreground">{formatNumber(c.memberCount)} عضو{c.publisher ? ` · منتشرکننده: ${c.publisher}` : ""}</span>
              {c.automatic ? <Badge variant="info" className="mt-1">✦ پیام‌های خودکار از عامل‌ها</Badge> : null}
            </button>
          </li>
        ))}
      </ul>
      <section aria-label={selected.name} className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
          <h2 className="text-h4">{selected.name}</h2>
          <AiAction key={selected.id} label="پیش‌نویس اطلاعیه" context={`کانال ${selected.name}`}>{(close) => <Draft initial={announcementDrafts[selected.id] ?? `اطلاعیه‌ی کانال «${selected.name}»: `} onPublish={(text) => { publish(text); close(); }} />}</AiAction>
        </header>
        {shown.length === 0 ? <p className="py-6 text-center text-body-sm text-muted-foreground">هنوز چیزی منتشر نشده است.</p> : (
          <ul className="flex flex-col gap-3">
            {shown.map((p) => (
              <li key={p.id} className={cn("flex flex-col gap-1 rounded-xl p-3", p.automatic ? "border border-primary/20 bg-primary/5" : "bg-muted/60")}>
                <span className="text-caption text-muted-foreground"><span className="font-medium text-foreground">{p.automatic ? "✦ " : ""}{p.author}</span> · {formatDay(p.createdAt)} {formatTime(p.createdAt)}</span>
                <p className="text-body">{p.text}</p>
                {p.automatic ? <Link href={p.automatic.href} className="w-fit text-caption text-primary hover:underline">خودکار از {p.automatic.label}</Link> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader><DialogTitle>کانال تازه</DialogTitle></DialogHeader>
          <form onSubmit={create} className="grid gap-3">
            <Field><FieldLabel htmlFor="ch-name">نام کانال</FieldLabel><Input id="ch-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: ایمنی و HSE" /></Field>
            <Button type="submit" className="w-fit" disabled={!name.trim()}>ساخت کانال</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Draft({ initial, onPublish }: { initial: string; onPublish: (text: string) => void }) {
  const [text, setText] = useState(initial);
  return (
    <div className="flex flex-col gap-2">
      <Textarea aria-label="متن اطلاعیه" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      <Button size="sm" className="w-fit" disabled={!text.trim()} onClick={() => onPublish(text.trim())}>انتشار در کانال</Button>
    </div>
  );
}
