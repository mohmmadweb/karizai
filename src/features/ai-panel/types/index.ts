/** One button under an AI answer. Its effect is temporary and resets on reload. */
export type AiAction = {
  label: string;
  /** Short confirmation shown as a toast once the action ran. */
  message: string;
  primary?: boolean;
  /** Optional link offered in the toast, for example the group the answer was sent to. */
  link?: { label: string; href: string };
  /** Tasks added in «فعالیت و وظایف من». */
  tasks?: { projectId: string; title: string; assigneeId: string }[];
  /** Extra effect supplied by the page that opened the panel, for example saving tags on a file. */
  run?: () => void;
};

/** A prepared answer of the AI panel; no model is called. */
export type AiAnswer = {
  /** Markdown text: bold, lists and tables. */
  text: string;
  sources?: string[];
  actions?: AiAction[];
};

export type AiAnswerKey = "brief" | "summarizeGroup" | "rca" | "doc" | "meta" | "tasks" | "risk" | "status" | "reply" | "moisture" | "generic";

/** Pages that have their own quick questions; the rest use `default`. */
export type QuickKey = "dash" | "groups" | "conversations" | "files" | "projects" | "default";

export type PageContext = { key: QuickKey; title: string };

export type PanelMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; answer: AiAnswer | null };

export type OpenPanelOptions = {
  /** Shown as «زمینه: …»; the current page name when absent. */
  context?: string;
  /** Asked right away, as if the user had typed it. */
  question?: string;
  /** A prepared answer to show; picked from the question when absent. */
  answer?: AiAnswer | AiAnswerKey;
};
