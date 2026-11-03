"use client";

import { useRouter } from "next/navigation";
import { useChat } from "./chat-provider";
import { ConversationItem } from "./conversation-item";

type ConversationListProps = {
  activeId: string | null;
  onNavigate?: () => void;
  /** Filters by title and message text. */
  query?: string;
  /** Only the conversations of this project; without it, the ones outside any project. */
  projectId?: string;
};

/** Recent conversations of the user, title only, for the sidebar. */
export function ConversationList({ activeId, onNavigate, query = "", projectId }: ConversationListProps) {
  const router = useRouter();
  const { state, rename, remove, moveConversation } = useChat();

  const needle = query.trim();
  const items = state.conversations.filter(
    (item) => item.projectId === projectId && (item.title.includes(needle) || (state.messages[item.id] ?? []).some((message) => message.text.includes(needle))),
  );
  const pool = state.conversations.filter((item) => item.projectId === projectId);
  if (pool.length === 0) {
    return <p className="px-3 py-2 text-caption text-muted-foreground">{projectId ? "این پروژه هنوز گفتگویی ندارد." : "هنوز گفتگویی ندارید."}</p>;
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
          projects={state.projects}
          onMove={(target) => moveConversation(item.id, target)}
          onRename={(title) => rename(item.id, title)}
          onDelete={() => { remove(item.id); if (item.id === activeId) router.replace("/chat"); }}
        />
      ))}
    </ul>
  );
}
