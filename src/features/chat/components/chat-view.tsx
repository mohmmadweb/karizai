"use client";

import { notFound } from "next/navigation";
import { ChatHeader } from "./chat-header";
import { useChat } from "./chat-provider";
import { Composer } from "./composer";
import { MessageList } from "./message-list";
import { ToolApprovalDialog } from "./tool-approval-dialog";

/** The chat page: model at the top, the conversation, and the message box. The sidebar lists conversations. */
export function ChatView({ conversationId }: { conversationId: string | null }) {
  const { state } = useChat();
  const conversation = state.conversations.find((item) => item.id === conversationId);
  if (conversationId && !conversation) notFound();
  const messages = conversationId ? (state.messages[conversationId] ?? []) : [];

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="flex items-center page-gutter py-2"><ChatHeader conversationId={conversationId} /></div>
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-16">
          <h1 className="px-4 text-center text-h2">چطور می‌توانم کمکتان کنم؟</h1>
          <div className="w-full"><Composer key={conversationId ?? "new"} conversationId={conversationId} /></div>
        </div>
      ) : (
        <>
          <MessageList conversationId={conversationId!} messages={messages} />
          <Composer key={conversationId ?? "new"} conversationId={conversationId} />
        </>
      )}
      {conversationId ? <ToolApprovalDialog conversationId={conversationId} /> : null}
    </section>
  );
}
