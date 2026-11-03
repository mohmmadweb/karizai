import type { WorkflowNode } from "../types";

/** The tool that registers a task in «وظایف من». */
export const createTaskToolId = "tool-28";

export type TaskFromStep = { projectName: string; title: string; priority: "high" | "normal" | "low" };

const priorities = { "فوری": "high", "عادی": "normal", "کم‌اهمیت": "low" } as const;

/** What the task-registering step asks for; `null` for any other step. */
export function taskFromStep(node: WorkflowNode): TaskFromStep | null {
  if (node.kind !== "tool" || node.config.toolId !== createTaskToolId) return null;
  const params = node.config.params ?? {};
  return {
    projectName: params.project ?? "",
    title: params.title?.trim() || "وظیفه‌ی جریان",
    priority: priorities[params.priority as keyof typeof priorities] ?? "normal",
  };
}
