"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchField } from "@/components/shared/search-field";
import { cn } from "@/lib/utils";
import { getBots } from "../data/bots";
import { getColleagues } from "../data/colleagues";
import { getGroups } from "../data/groups";
import { useMessenger } from "./messenger-provider";
import { ThreadAvatar } from "./thread-avatar";

/** The chats of the messenger beside the open one: groups and channels (they open on their own pages), then the bots and the colleagues, with a search box, the start of the last message and the unread count. */
export function ThreadList({ activeId }: { activeId: string }) {
  const { lastOf, unreadOf } = useMessenger();
  const [query, setQuery] = useState("");
  const match = (thread: { name: string }) => thread.name.includes(query.trim());
  const sections: { title: string; threads: { id: string; name: string; href: string }[] }[] = [
    { title: "گروه‌ها و کانال‌ها", threads: getGroups().filter(match) },
    { title: "پیام‌های مستقیم", threads: [...getBots(), ...getColleagues()].filter(match).map((thread) => ({ ...thread, href: `/messenger/${thread.id}` })) },
  ];
  return (
    <aside aria-label="گفتگوها" className="hidden min-h-0 w-80 shrink-0 flex-col gap-3 border-e bg-card p-3 md:flex">
      <SearchField value={query} onValueChange={setQuery} label="جست‌وجوی گفتگوها" placeholder="جست‌وجوی گفتگوها" className="sm:max-w-none" />
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {sections.every((section) => section.threads.length === 0) ? <p className="px-2 py-3 text-body-sm text-muted-foreground">گفتگویی پیدا نشد.</p> : null}
        {sections.filter((section) => section.threads.length > 0).map((section) => (
          <section key={section.title} aria-label={section.title} className="flex flex-col gap-0.5">
            <h2 className="px-2 pb-1 text-caption text-muted-foreground">{section.title}</h2>
            <ul className="flex flex-col gap-0.5">
              {section.threads.map((thread) => {
                const last = lastOf(thread.id);
                const unread = unreadOf(thread.id);
                return (
                  <li key={thread.id}>
                    <Link href={thread.href} aria-current={thread.id === activeId ? "page" : undefined} className={cn("flex items-center gap-3 rounded-lg p-2 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50", thread.id === activeId && "bg-muted")}>
                      <ThreadAvatar threadId={thread.id} className="size-10" />
                      <span className="flex min-w-0 flex-1 flex-col text-start">
                        <span className="truncate text-label">{thread.name}</span>
                        {last ? <span className="truncate text-caption text-muted-foreground">{last.from === "me" ? "شما: " : last.sender ? `${last.sender}: ` : ""}{last.alert?.title ?? last.text}</span> : null}
                      </span>
                      {unread > 0 ? <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-caption text-primary-foreground">{unread.toLocaleString("fa-IR")}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}
