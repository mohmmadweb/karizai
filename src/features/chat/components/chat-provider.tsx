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
  /** The project the next new conversation will be put in; `null` for none. */
  draftProjectId: string | null;
  setDraftProjectId: (id: string | null) => void;
  createProject: (name: string) => string;
  renameProject: (id: string, name: string) => void;
  /** Deleting a project keeps its conversations. */
  removeProject: (id: string) => void;
  moveConversation: (id: string, projectId: string | null) => void;
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
  /**
   * Adds a finished conversation with an Agent's report, for example what a workflow run wrote; it shows in the
   * recent chats. Returns the conversation id.
   */
  addReport: (report: ChatReport) => string;
};

/** A report an Agent left without being asked in a chat: the line that started it and the answer. */
export type ChatReport = { title: string; prompt: string; text: string; agentName?: string; modelName?: string; sources?: Message["sources"] };

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
    projects: [],
    messages: initialMessages,
    draft: emptySettings,
    used: getQuota().used,
  });
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const { agents } = useAgents();
  const { allowedModels: models, modelById } = useModels();
  const agentModelName = (agentId?: string) => modelById(agents.find((item) => item.id === agentId)?.defaultModelId ?? "")?.name ?? "خودکار";
  // The supervisor is independent: it prefers a model other than the one that answered, and a
  // sensitive Agent only ever gets an internal model.
  // The model list is ordered from strongest to lightest, so a stronger model is one that comes earlier.
  const supervisorModels = ({ sensitive, answeringModel }: { sensitive: boolean; answeringModel: string }) => {
    const pool = models.filter((model) => model.isAvailable && (!sensitive || model.isInternal));
    const at = pool.findIndex((model) => model.name === answeringModel);
    return { independent: (pool.find((model) => model.name !== answeringModel) ?? pool[0])?.name ?? null, stronger: at > 0 ? pool[0].name : null };
  };
  // A name not in the list (for example a model of a real provider that is gone) counts as external.
  const isInternalModel = (name: string) => Boolean(models.find((model) => model.name === name)?.isInternal);
  const engine = useChatEngine(stateRef, dispatch, { agentModelName, supervisorModels, isInternalModel });
  const counter = useRef(0);
  const [prefill, setPrefill] = useState("");
  const [draftProjectId, setDraftProjectId] = useState<string | null>(null);

  const value = useMemo<ChatContextValue>(
    () => ({
      state,
      prefill,
      setPrefill,
      createConversation: (title) => {
        const id = `conv-new-${++counter.current}`;
        dispatch({
          type: "create",
          conversation: { id, title, updatedAt: new Date().toISOString(), settings: stateRef.current.draft, projectId: draftProjectId ?? undefined },
        });
        setDraftProjectId(null);
        dispatch({ type: "reset-draft" });
        return id;
      },
      rename: (id, title) => dispatch({ type: "rename", id, title }),
      draftProjectId,
      setDraftProjectId,
      createProject: (name) => {
        const id = `proj-new-${++counter.current}`;
        dispatch({ type: "create-project", project: { id, name } });
        return id;
      },
      renameProject: (id, name) => dispatch({ type: "rename-project", id, name }),
      removeProject: (id) => dispatch({ type: "remove-project", id }),
      moveConversation: (id, projectId) => dispatch({ type: "move", id, projectId }),
      remove: (id) => dispatch({ type: "remove", id }),
      updateSettings: (id, patch) => dispatch({ type: "settings", id, patch }),
      addReport: ({ title, prompt, text, agentName, modelName, sources = [] }) => {
        const id = `conv-new-${++counter.current}`;
        const now = new Date().toISOString();
        dispatch({ type: "create", conversation: { id, title, updatedAt: now, settings: emptySettings } });
        dispatch({
          type: "append", id, messages: [
            { id: `${id}-q`, role: "user", text: prompt, createdAt: now, status: "done", sources: [], attachments: [] },
            { id: `${id}-a`, role: "assistant", text, createdAt: now, finishedAt: now, status: "done", agentName, modelName, sources, attachments: [] },
          ],
        });
        return id;
      },
      ...engine,
    }),
    [state, prefill, draftProjectId, engine],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const value = useContext(ChatContext);
  if (!value) throw new Error("useChat must be used inside ChatProvider");
  return value;
}
