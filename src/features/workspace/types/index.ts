export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "high" | "normal" | "low";
/** Where a task came from: made by hand, or made by the assistant from a meeting, a workflow, an Agent, a chat or a group. */
export type TaskSource = "manual" | "minutes" | "reorder-flow" | "quality-agent" | "conversation" | "group";
export type RiskLevel = "high" | "medium" | "low";

export type Project = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  /** Person ids: the current user or a colleague. */
  memberIds: string[];
  /** ISO date. */
  dueDate: string;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  assigneeId: string;
  status: TaskStatus;
  priority: TaskPriority;
  /** ISO date. */
  dueDate: string;
  /** Absent means the task was made by hand. */
  source?: TaskSource;
  /** ISO date and time the task was registered; only tasks made in this session have it. */
  createdAt?: string;
};

/** What the assistant says about a project's delay risk. */
export type ProjectInsight = { projectId: string; risk: RiskLevel; reason: string; suggestion: string };

export const statusLabels: Record<TaskStatus, string> = { todo: "انجام‌نشده", doing: "در حال انجام", done: "انجام‌شده" };
export const priorityLabels: Record<TaskPriority, string> = { high: "فوری", normal: "عادی", low: "کم‌اهمیت" };
export const riskLabels: Record<RiskLevel, string> = { high: "بالا", medium: "متوسط", low: "کم" };
/** AI sources carry the «✦» sign, like everything the assistant makes. */
export const sourceLabels: Record<TaskSource, string> = {
  manual: "دستی",
  minutes: "✦ صورت‌جلسه",
  "reorder-flow": "✦ جریان سفارش مواد",
  "quality-agent": "✦ دستیار کیفیت",
  conversation: "✦ گفتگو",
  group: "✦ خلاصه‌ی گروه",
};
