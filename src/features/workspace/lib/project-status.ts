import { getProjectInsight } from "../data/workspace";
import type { Project, ProjectInsight, Task } from "../types";
import { daysFromToday } from "./today";

export type ProjectStatus = { percent: number; done: number; open: number; overdue: number; insight: ProjectInsight };

/** Progress and delay risk of a project from its tasks; projects without a prepared reading get one from their overdue tasks. */
export function projectStatus(project: Project, tasks: Task[]): ProjectStatus {
  const own = tasks.filter((task) => task.projectId === project.id);
  const done = own.filter((task) => task.status === "done").length;
  const overdue = own.filter((task) => task.status !== "done" && daysFromToday(task.dueDate) < 0).length;
  const insight: ProjectInsight = getProjectInsight(project.id) ?? {
    projectId: project.id, risk: overdue > 1 ? "high" : overdue === 1 ? "medium" : "low",
    reason: own.length === 0 ? "پروژه تازه است و هنوز وظیفه‌ای ندارد." : `${overdue} وظیفه از موعد گذشته است.`,
    suggestion: own.length === 0 ? "وظایف را از صورت‌جلسه‌ی شروع پروژه بسازید." : "وظایف عقب‌افتاده را دوباره زمان‌بندی کنید.",
  };
  return { percent: own.length === 0 ? 0 : Math.round((done / own.length) * 100), done, open: own.length - done, overdue, insight };
}
