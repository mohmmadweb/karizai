"use client";

import { ChatContainerContent, ChatContainerRoot } from "@/components/ui/chat-container";
import { ScrollButton } from "@/components/ui/scroll-button";
import { useChat } from "./chat-provider";
import { MessageBubble } from "./message-bubble";
import type { Message } from "../types";

type MessageListProps = { conversationId: string; messages: Message[] };

/** Scrolling conversation that sticks to the newest answer, like other chat apps. */
export function MessageList({ conversationId, messages }: MessageListProps) {
  const { approveTool, rejectTool, retry } = useChat();
  return (
    <ChatContainerRoot className="relative min-h-0 flex-1">
      <ChatContainerContent className="mx-auto max-w-3xl gap-8 page-gutter py-6" aria-live="polite">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onApprove={() => approveTool(conversationId, message.id)}
            onReject={() => rejectTool(conversationId, message.id)}
            onRetry={() => retry(conversationId, message.id)}
          />
        ))}
      </ChatContainerContent>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <ScrollButton className="pointer-events-auto shadow-md" aria-label="رفتن به آخرین پیام" />
      </div>
    </ChatContainerRoot>
  );
}
