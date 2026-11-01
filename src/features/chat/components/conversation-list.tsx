"use client";

import { useRouter } from "next/navigation";
import { useChat } from "./chat-provider";
import { ConversationItem } from "./conversation-item";

type ConversationListProps = { activeId: string | null; onNavigate?: () => void; /** Filters by title and message text. */ query?: string };

/** Recent conversations of the user, title only, for the sidebar. */
export function ConversationList({ activeId, onNavigate, query = "" }: ConversationListProps) {
  const router = useRouter();
  const { state, rename, remove } = useChat();

  const needle = query.trim();
  const items = state.conversations.filter(
    (item) => item.title.includes(needle) || (state.messages[item.id] ?? []).some((message) => message.text.includes(needle)),
  );
  if (state.conversations.length === 0) {
    return <p className="px-3 py-2 text-caption text-muted-foreground">هنوز گفتگویی ندارید.</p>;
  }
  if (items.length === 0) {
    return <p className="px-3 py-2 text-caption text-muted-foreground">نتیجه‌ای پیدا نشد.</p>;
  }
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => (
        <ConversationItem
          key={item.id}
          compact
          conversation={item}
          active={item.id === activeId}
          onNavigate={onNavigate}
          onRename={(title) => rename(item.id, title)}
          onDelete={() => { remove(item.id); if (item.id === activeId) router.replace("/chat"); }}
        />
      ))}
    </ul>
  );
}
