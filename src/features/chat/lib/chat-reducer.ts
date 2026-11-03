import type { ChatProject, Conversation, ConversationSettings, Message } from "../types";

export type ChatState = {
  conversations: Conversation[];
  projects: ChatProject[];
  messages: Record<string, Message[]>;
  /** Settings of the conversation that is not created yet. */
  draft: ConversationSettings;
  /** Tokens used in the current period. */
  used: number;
};

export type ChatAction =
  | { type: "create"; conversation: Conversation }
  | { type: "rename"; id: string; title: string }
  | { type: "remove"; id: string }
  | { type: "create-project"; project: ChatProject }
  | { type: "rename-project"; id: string; name: string }
  | { type: "remove-project"; id: string }
  | { type: "move"; id: string; projectId: string | null }
  | { type: "settings"; id: string | null; patch: Partial<ConversationSettings> }
  | { type: "append"; id: string; messages: Message[] }
  | { type: "patch-message"; id: string; messageId: string; patch: Partial<Message> }
  | { type: "reset-draft" }
  | { type: "usage"; amount: number };

export const emptySettings: ConversationSettings = {
  model: "auto",
  connectionIds: [],
  agentId: null,
  webSearch: true,
  knowledge: false,
  supervisor: false,
  optimizer: false,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "create":
      return {
        ...state,
        conversations: [action.conversation, ...state.conversations],
        messages: { ...state.messages, [action.conversation.id]: [] },
      };
    case "rename":
      return {
        ...state,
        conversations: state.conversations.map((item) =>
          item.id === action.id ? { ...item, title: action.title } : item,
        ),
      };
    case "remove": {
      const { [action.id]: removed, ...rest } = state.messages;
      void removed;
      return {
        ...state,
        conversations: state.conversations.filter((item) => item.id !== action.id),
        messages: rest,
      };
    }
    case "create-project":
      return { ...state, projects: [...state.projects, action.project] };
    case "rename-project":
      return { ...state, projects: state.projects.map((item) => (item.id === action.id ? { ...item, name: action.name } : item)) };
    case "remove-project":
      // The conversations stay; they go back to the recent list.
      return {
        ...state,
        projects: state.projects.filter((item) => item.id !== action.id),
        conversations: state.conversations.map((item) => (item.projectId === action.id ? { ...item, projectId: undefined } : item)),
      };
    case "move":
      return {
        ...state,
        conversations: state.conversations.map((item) => (item.id === action.id ? { ...item, projectId: action.projectId ?? undefined } : item)),
      };
    case "settings":
      if (action.id === null) {
        return { ...state, draft: { ...state.draft, ...action.patch } };
      }
      return {
        ...state,
        conversations: state.conversations.map((item) =>
          item.id === action.id
            ? { ...item, settings: { ...item.settings, ...action.patch } }
            : item,
        ),
      };
    case "append":
      return {
        ...state,
        conversations: state.conversations
          .map((item) =>
            item.id === action.id
              ? { ...item, updatedAt: action.messages.at(-1)?.createdAt ?? item.updatedAt }
              : item,
          )
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
        messages: {
          ...state.messages,
          [action.id]: [...(state.messages[action.id] ?? []), ...action.messages],
        },
      };
    case "patch-message":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.id]: (state.messages[action.id] ?? []).map((item) =>
            item.id === action.messageId ? { ...item, ...action.patch } : item,
          ),
        },
      };
    case "reset-draft":
      return { ...state, draft: emptySettings };
    case "usage":
      return { ...state, used: state.used + action.amount };
  }
}
