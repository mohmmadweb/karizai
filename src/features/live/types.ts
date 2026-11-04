import type { AlertContent } from "@/features/messenger/types";
import type { DocumentKind } from "@/features/knowledge/types";
import type { TaskPriority } from "@/features/workspace/types";
import type { Run, RunStep, Workflow, WorkflowNode } from "@/features/workflows/types";

/** Where an effect landed in the system; each has its own icon and page. */
export type EffectKind = "message" | "group" | "channel" | "alert" | "task" | "calendar" | "file" | "chat" | "notification" | "audit";

/**
 * What a workflow step does in another part of the system, declared in the story registry
 * (`data/stories.ts`) and carried out by `LiveProvider` with the providers' own functions.
 * `label` is the short line the activity feed shows; without it a default line per kind is used.
 */
export type EffectSpec = { label?: string } & (
  /** A message from the workflow in a colleague's chat; the colleague may answer a moment later. */
  | { kind: "message"; to: string; text: string; reply?: string }
  /** A card in a group of the social network (it also counts as unread in the messenger). */
  | { kind: "group"; groupId: string; text: string; alert: Omit<AlertContent, "workflowId"> }
  /** A post in a one-way channel. */
  | { kind: "channel"; channelId: string; text: string }
  /** An alert card in «ربات هشدار». */
  | { kind: "alert"; text: string; alert: Omit<AlertContent, "workflowId"> }
  /** A task in «فعالیت و وظایف من»; `project` is a project name, `dueInDays` counts from the demo day. */
  | { kind: "task"; title: string; project: string; priority: TaskPriority; dueInDays: number; assignee?: string }
  /** A meeting in «تقویم کاری من»; `dayOffset` from the demo day, `time` in Tehran time («10:00»). */
  | { kind: "calendar"; title: string; dayOffset: number; time: string; durationMinutes: number; place: string }
  /** A file made by AI in «دانش سازمانی». */
  | { kind: "file"; title: string; fileKind: DocumentKind; folder: string; sizeKb: number; summary: string; keywords?: string[] }
  /** A conversation with the Agent's report in the recent chats. */
  | { kind: "chat"; title: string; prompt: string; text: string; agentName: string; sources?: string[] }
  /** An item in the bell of the top bar. */
  | { kind: "notification"; title: string; description: string; href?: string }
);

export type StoryContext = { workflow: Workflow; node: WorkflowNode; step: RunStep; run: Run };

/** One thing that really happened in this visit, with the page it landed on. */
export type LiveEffect = {
  id: string;
  kind: EffectKind;
  runId: string;
  workflowId: string;
  workflowName: string;
  /** The step that caused it; absent for what the run did as a whole (audit summary). */
  nodeId?: string;
  stepLabel?: string;
  /** Short Persian line, for example «پیام در گروه «فروش» گذاشته شد». */
  label: string;
  /** One more line of detail, for example the file name or the task title. */
  detail?: string;
  href: string;
  /** ISO date and time. */
  at: string;
};

export type NotificationIcon = EffectKind | "run" | "failed" | "approval" | "schedule" | "event";

export type LiveNotification = {
  id: string;
  icon: NotificationIcon;
  title: string;
  description?: string;
  href?: string;
  /** ISO date and time. */
  at: string;
  read: boolean;
};

/** One row of the admin audit log written by a workflow step in this visit (same fields as the admin's `AuditEvent`). */
export type LiveAuditEntry = {
  id: string;
  at: string;
  user: string;
  unit: string;
  agent: string;
  source: string;
  model: string;
  channel: "workflow";
  result: "success" | "pending" | "denied";
  action: string;
  reason?: string;
  maskedCount: number;
  durationMs: number;
};

/** What a run started in this visit did and cost. */
export type RunSummary = { runId: string; effects: number; costToman: number; tokens: number };
