"use client";

import { useRouter } from "next/navigation";
import { useChat } from "@/features/chat/components/chat-provider";

/** Opens a new conversation in the assistant with a question in the message box and, optionally, an Agent chosen. */
export function useAskAssistant() {
  const router = useRouter();
  const { setPrefill, updateSettings } = useChat();
  return (question: string, agentId?: string) => {
    if (agentId) updateSettings(null, { agentId });
    if (question) setPrefill(question);
    router.push("/chat");
  };
}
