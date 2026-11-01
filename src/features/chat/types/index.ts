import type { ModelChoice } from "@/features/model-catalog/types";
import type { ToolRun } from "@/features/connections/types";

export type AttachmentKind = "pdf" | "word" | "excel" | "image";
export type AttachmentStatus = "uploading" | "processing" | "ready" | "failed";

export type Attachment = {
  id: string;
  name: string;
  kind: AttachmentKind;
  status: AttachmentStatus;
  error?: string;
};

export type Source = {
  id: string;
  title: string;
  /** Web sources carry a link; document sources carry the section they came from. */
  url?: string;
  section?: string;
  /** The passage the answer relied on; shown when the source is opened. */
  excerpt?: string;
  /** "chat" is a conversation of a colleague the user is allowed to read. */
  kind: "document" | "web" | "chat";
};

export type DisplayKind = "table" | "bar" | "line" | "pie" | "card";

/** Structured output of the data assistant; the chat turns it into a table, chart, or card. */
export type StructuredResult = {
  /** The read-only query that produced the numbers; the user can always see it. */
  query: string;
  columns: string[];
  rows: (string | number)[][];
  suggested: DisplayKind;
};

export type MessageStatus = "streaming" | "done" | "stopped" | "error";

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** What was sent to the model (sensitive values replaced); user messages only. */
  sentText?: string;
  /** ISO date. */
  createdAt: string;
  status: MessageStatus;
  /** The model that really answered (assistant messages). */
  modelName?: string;
  agentName?: string;
  toolRun?: ToolRun;
  sources: Source[];
  attachments: Attachment[];
  error?: string;
  /** Tools that really ran for this answer. */
  toolNames?: string[];
  /** Short explanations, for example a tool that was skipped. */
  notes?: string[];
  structured?: StructuredResult;
  /** Steps of a multi-agent answer; they stay above the answer. */
  timeline?: TimelineStep[];
  /** Why the router chose this model, or how a fallback happened. */
  routerReason?: string;
  /** Number of sensitive values replaced before sending. */
  maskedCount?: number;
};

export type TimelineStatus = "pending" | "running" | "waiting-approval" | "done" | "failed";

/** One step of a multi-agent answer, shown above the final text. */
export type TimelineStep = {
  id: string;
  kind: "thinking" | "agent" | "tool" | "approval" | "supervisor";
  title: string;
  status: TimelineStatus;
  modelName?: string;
  inputTokens?: number;
  outputTokens?: number;
  /** Short progress lines that appear while the step runs. */
  lines: string[];
  /** Where the step got its data, for example «اتصال: انبار و موجودی (SQL Server)»; shown when the row is opened. */
  via?: string;
  result?: string;
  error?: string;
  /** For a step that needs the user's approval before it runs. */
  approval?: { toolName: string; description: string; inputs: { label: string; value: string }[] };
};

/** A connection whose answer is always the same text, after its tool steps. */
export type FixedConnectionReply = {
  connectionId: string;
  connectionName: string;
  /** One step per tool, shown running and then done before the text streams. */
  steps: { id: string; title: string; lines: string[]; result: string }[];
  text: string;
};

export type ConversationSettings = {
  model: ModelChoice;
  connectionIds: string[];
  agentId: string | null;
  /** The smart supervisor checks answers of this conversation; off by default. */
  supervisor: boolean;
  /** Web search for this conversation; the user may turn it off. */
  webSearch: boolean;
  /** Answers come from the organization's documents (retrieval), with sources. */
  knowledge: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  /** ISO date. */
  updatedAt: string;
  settings: ConversationSettings;
};

/** One prepared step of a canned answer; the chat shows it running and then done. */
export type ScriptedStep = { id: string; kind: "thinking" | "tool"; title: string; /** Connection or source the step used. */ via?: string; lines: string[]; result: string };

/** A canned answer for a demo: steps, text, sources and an optional table. No model is called. */
export type ScriptedReply = {
  steps: ScriptedStep[];
  text: string;
  sources?: Source[];
  structured?: StructuredResult;
  /** True when no model answered, so no model badge is shown. */
  fixed?: boolean;
};

/** Where a canned answer applies; without `match` it is the answer for any other question of that scope. */
export type ScriptedEntry = {
  scope: { agentId?: string; connectionId?: string; connectionName?: string; knowledge?: boolean };
  match?: RegExp;
  reply: ScriptedReply;
};
