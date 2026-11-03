export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "high" | "normal" | "low";

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
  /** ISO date and time the task was registered; only tasks made in this session have it. */
  createdAt?: string;
};

export const statusLabels: Record<TaskStatus, string> = { todo: "انجام‌نشده", doing: "در حال انجام", done: "انجام‌شده" };
export const priorityLabels: Record<TaskPriority, string> = { high: "فوری", normal: "عادی", low: "کم‌اهمیت" };
