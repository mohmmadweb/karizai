"use client";

import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/features/chat/components/chat-provider";

type TopBarSearchProps = { query: string; onQueryChange: (query: string) => void };

/** Search in the top bar: it filters the recent conversations as you type, and «جستجو» opens the first match. */
export function TopBarSearch({ query, onQueryChange }: TopBarSearchProps) {
  const router = useRouter();
  const { state } = useChat();
  const needle = query.trim();
  const first = needle ? state.conversations.find((item) => item.title.includes(needle) || (state.messages[item.id] ?? []).some((message) => message.text.includes(needle))) : undefined;
  return (
    <form
      role="search"
      onSubmit={(event) => { event.preventDefault(); if (first) router.push(`/chat/${first.id}`); }}
      className="relative hidden h-11 min-w-0 max-w-xl flex-1 items-center rounded-xl border bg-card md:flex"
    >
      <SearchIcon aria-hidden className="pointer-events-none absolute start-3 size-4 text-muted-foreground" />
      <Input
        type="search"
        aria-label="جستجو در گفتگوها"
        placeholder="جستجو در گفتگوها..."
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        className="h-full border-0 bg-transparent ps-9 shadow-none focus-visible:ring-0"
      />
      <Button type="submit" size="sm" className="m-1.5 h-8" disabled={!first}>جستجو</Button>
    </form>
  );
}
