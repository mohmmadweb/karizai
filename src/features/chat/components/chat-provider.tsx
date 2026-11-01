"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { useAgents } from "@/features/agents/components/agents-provider";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { getQuota } from "@/features/user-session/data/session";
import { useChatEngine, type SendInput } from "../hooks/use-chat-engine";
import { chatReducer, emptySettings, type ChatState } from "../lib/chat-reducer";
import type { Conversation, ConversationSettings, Message } from "../types";

type ChatContextValue = {
  state: ChatState;
  /** Text a page (home, knowledge) wants in the message box of a new conversation. */
  prefill: string;
  setPrefill: (text: string) => void;
  /** Creates a conversation from the draft settings and returns its id. */
  createConversation: (title: string) => string;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
  /** `null` edits the settings of the conversation that does not exist yet. */
  updateSettings: (id: string | null, patch: Partial<ConversationSettings>) => void;
  send: (input: SendInput) => void;
  stop: (id: string, messageId: string) => void;
  approveTool: (id: string, messageId: string) => void;
  rejectTool: (id: string, messageId: string) => void;
  retry: (id: string, messageId: string) => void;
  /** Answers the approval question of a step in a multi-agent timeline. */
  decideStep: (messageId: string, approved: boolean) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({
  initialConversations,
  initialMessages,
  children,
}: {
  initialConversations: Conversation[];
  initialMessages: Record<string, Message[]>;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(chatReducer, {
    conversations: initialConversations,
    messages: initialMessages,
    draft: emptySettings,
    used: getQuota().used,
  });
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const { agents } = useAgents();
  const { models, modelById } = useModels();
  const agentModelName = (agentId?: string) => modelById(agents.find((item) => item.id === agentId)?.defaultModelId ?? "")?.name ?? "خودکار";
  // The supervisor is independent: it prefers a model other than the one that answered, and a
  // sensitive Agent only ever gets an internal model.
  // The model list is ordered from strongest to lightest, so a stronger model is one that comes earlier.
  const supervisorModels = ({ sensitive, answeringModel }: { sensitive: boolean; answeringModel: string }) => {
    const pool = models.filter((model) => model.isAvailable && (!sensitive || model.isInternal));
    const at = pool.findIndex((model) => model.name === answeringModel);
    return { independent: (pool.find((model) => model.name !== answeringModel) ?? pool[0])?.name ?? null, stronger: at > 0 ? pool[0].name : null };
  };
  const engine = useChatEngine(stateRef, dispatch, { agentModelName, supervisorModels });
  const counter = useRef(0);
  const [prefill, setPrefill] = useState("");

  const value = useMemo<ChatContextValue>(
    () => ({
      state,
      prefill,
      setPrefill,
      createConversation: (title) => {
        const id = `conv-new-${++counter.current}`;
        dispatch({
          type: "create",
          conversation: { id, title, updatedAt: new Date().toISOString(), settings: stateRef.current.draft },
        });
        dispatch({ type: "reset-draft" });
        return id;
      },
      rename: (id, title) => dispatch({ type: "rename", id, title }),
      remove: (id) => dispatch({ type: "remove", id }),
      updateSettings: (id, patch) => dispatch({ type: "settings", id, patch }),
      ...engine,
    }),
    [state, prefill, engine],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const value = useContext(ChatContext);
  if (!value) throw new Error("useChat must be used inside ChatProvider");
  return value;
}
