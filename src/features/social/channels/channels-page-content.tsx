"use client";

import Link from "@/components/shared/app-link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { BellIcon, ChevronRightIcon, MegaphoneIcon } from "lucide-react";
import { toast } from "sonner";
import { FilterPill, MotoSearch, PaneHeader, RoundFab, RoundIconButton, TwoPaneShell } from "@/components/shared/moto/moto";
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
  const [selectedId, setSelectedId] = useState<string | null>(() => (requested && channels.some((c) => c.id === requested) ? requested : null));
  const [query, setQuery] = useState("");
  const [newest, setNewest] = useState(true);
  const [seenRequest, setSeenRequest] = useState(requested);
  if (requested !== seenRequest) {
    setSeenRequest(requested);
    if (requested && channels.some((c) => c.id === requested)) setSelectedId(requested);
  }
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const counter = useRef(0);
  const selected = channels.find((c) => c.id === selectedId) ?? null;
  const selectedKey = selected?.id ?? "";
  // What workflows published in the channel during this visit, for example the production plan in «هشدارهای تولید».
  const { messagesOf, markRead } = useMessenger();
  const fromFlows: ChannelPost[] = messagesOf(selectedKey).map((item) => ({
    id: item.id, channelId: selectedKey, author: item.sender ?? "جریان‌ها", createdAt: item.createdAt, text: item.text,
    automatic: { href: item.alert?.workflowId ? `/workflows/${item.alert.workflowId}` : "/workflows", label: item.sender ?? "جریان‌ها" },
  }));
  useEffect(() => { if (selectedKey) markRead(selectedKey); }, [selectedKey, fromFlows.length, markRead]);
  const shown = [...posts.filter((p) => p.channelId === selectedKey), ...fromFlows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const publish = (text: string) => { if (!selected) return; setPosts((list) => [...list, { id: `cp-new-${++counter.current}`, channelId: selected.id, author: getCurrentUser().name, createdAt: new Date().toISOString(), text }]); toast.success(`در کانال «${selected.name}» منتشر شد`); };

  function create(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    const channel: Channel = { id: `ch-new-${++counter.current}`, name: name.trim(), description: "کانال تازه", memberCount: 1, publisher: getCurrentUser().name };
    setChannels((list) => [...list, channel]); setSelectedId(channel.id); setName(""); setCreating(false);
    toast.success(`کانال «${channel.name}» ساخته شد`);
  }

  const shownChannels = channels.filter((c) => !query.trim() || c.name.includes(query.trim()));
  if (!newest) shownChannels.reverse();

  const list = (
    <>
      <PaneHeader
        title="کانال‌ها"
        icon={MegaphoneIcon}
        tools={<RoundIconButton label="اعلان‌ها" icon={BellIcon} href="/alerts" />}
        search={<MotoSearch value={query} onChange={setQuery} placeholder="جستجوی کانال‌ها" className="sm:max-w-none" />}
        filters={<FilterPill label="ترتیب" sort value={newest ? "new" : "old"} options={[{ value: "new", label: "جدیدترین" }, { value: "old", label: "قدیمی‌ترین" }]} onChange={(v) => setNewest(v === "new")} />}
      />
      <ul className="flex flex-col gap-0.5 p-2 pb-20" aria-label="فهرست کانال‌ها">
        {shownChannels.length === 0 ? <li className="px-2 py-3 text-body-sm text-muted-foreground">کانالی پیدا نشد.</li> : null}
        {shownChannels.map((c) => (
          <li key={c.id}>
            <button type="button" aria-current={c.id === selectedKey ? "true" : undefined} onClick={() => setSelectedId(c.id)} className={cn("flex w-full items-center gap-3 rounded-lg p-2 text-start outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50", c.id === selectedKey && "bg-muted")}>
              <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><MegaphoneIcon className="size-5" /></span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-label">{c.name}</span>
                <span className="truncate text-caption text-muted-foreground">{formatNumber(c.memberCount)} عضو{c.publisher ? ` · منتشرکننده: ${c.publisher}` : ""}</span>
                {c.automatic ? <Badge variant="info" className="mt-1 w-fit">✦ پیام‌های خودکار از عامل‌ها</Badge> : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <>
      <TwoPaneShell list={list} hasOpenItem={selected !== null} emptyText="یک کانال را انتخاب کنید" fab={<RoundFab label="ایجاد کانال" onClick={() => setCreating(true)} />}>
        {selected ? (
          <section aria-label={selected.name} className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 p-4">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
              <div className="flex min-w-0 items-center gap-2">
                <Button type="button" variant="ghost" size="icon" aria-label="بازگشت به فهرست کانال‌ها" onClick={() => setSelectedId(null)} className="md:hidden"><ChevronRightIcon aria-hidden /></Button>
                <div className="min-w-0"><h2 className="truncate text-h4">{selected.name}</h2><p className="truncate text-caption text-muted-foreground">{selected.description}</p></div>
              </div>
              <AiAction key={selected.id} label="پیش‌نویس اطلاعیه" context={`کانال ${selected.name}`}>{(close) => <Draft initial={announcementDrafts[selected.id] ?? `اطلاعیه‌ی کانال «${selected.name}»: `} onPublish={(text) => { publish(text); close(); }} />}</AiAction>
            </header>
            {shown.length === 0 ? <p className="py-6 text-center text-body-sm text-muted-foreground">هنوز چیزی منتشر نشده است.</p> : (
              <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
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
        ) : null}
      </TwoPaneShell>
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader><DialogTitle>کانال تازه</DialogTitle></DialogHeader>
          <form onSubmit={create} className="grid gap-3">
            <Field><FieldLabel htmlFor="ch-name">نام کانال</FieldLabel><Input id="ch-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: ایمنی و HSE" /></Field>
            <Button type="submit" className="w-fit" disabled={!name.trim()}>ساخت کانال</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
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
