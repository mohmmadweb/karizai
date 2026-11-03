"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import { formatDate } from "@/lib/format";
import { taskFromStep } from "@/features/workflows/lib/task-step";
import { currentUserId } from "../lib/people";
import { addDays } from "../lib/today";
import { getProjects, getTasks } from "../data/workspace";
import type { Project, Task, TaskPriority, TaskSource, TaskStatus } from "../types";

type TaskExtras = { source?: TaskSource; dueDate?: string };

type WorkspaceContextValue = {
  projects: Project[];
  tasks: Task[];
  setStatus: (taskId: string, status: TaskStatus) => void;
  /** Adds a task; it stays only until the page is reloaded. Without a source it counts as made by hand. */
  addTask: (projectId: string, title: string, assigneeId: string, priority?: TaskPriority, extras?: TaskExtras) => void;
  /** Adds a project for the current user and returns its id; it has no page of its own (see `hasProjectPage`). */
  addProject: (name: string, description: string, dueDate: string) => string;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

/** Projects and tasks of the workspace, in memory. */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState(getProjects);
  const [tasks, setTasks] = useState(getTasks);
  const counter = useRef(0);
  const router = useRouter();
  const { workflows, runs } = useWorkflows();
  // Runs that existed on arrival already have their tasks in the seed.
  const [knownRunIds] = useState(() => new Set(runs.map((run) => run.id)));
  const registered = useRef(new Set<string>());

  // A workflow run that reaches a «register task» step adds the task for the current user, as it happens.
  useEffect(() => {
    for (const run of runs) {
      if (knownRunIds.has(run.id)) continue;
      const workflow = workflows.find((item) => item.id === run.workflowId);
      for (const step of run.steps) {
        const key = `${run.id}:${step.nodeId}`;
        const node = workflow?.nodes.find((item) => item.id === step.nodeId);
        const wanted = node ? taskFromStep(node) : null;
        if (!wanted || step.status !== "succeeded" || registered.current.has(key)) continue;
        registered.current.add(key);
        const project = getProjects().find((item) => item.name === wanted.projectName) ?? getProjects()[0];
        const id = `task-flow-${registered.current.size}`;
        setTasks((list) => [...list, { id, projectId: project.id, title: wanted.title, assigneeId: currentUserId(), status: "todo", priority: wanted.priority, dueDate: new Date(Date.now() + 3 * 864e5).toISOString(), source: "reorder-flow", createdAt: new Date().toISOString() }]);
        toast.success("وظیفه‌ی تازه ثبت شد", { description: `«${wanted.title}» ساعت ${formatDate(new Date(), { timeStyle: "medium" })} در «فعالیت و وظایف من» ثبت شد.`, action: { label: "دیدن وظایف", onClick: () => router.push("/messenger/tasks") } });
      }
    }
  }, [runs, workflows, knownRunIds, router]);
  const value = useMemo<WorkspaceContextValue>(() => ({
    projects,
    tasks,
    setStatus: (taskId, status) => setTasks((list) => list.map((task) => (task.id === taskId ? { ...task, status } : task))),
    addTask: (projectId, title, assigneeId, priority = "normal", extras = {}) =>
      setTasks((list) => [...list, { id: `task-new-${++counter.current}`, projectId, title, assigneeId, status: "todo", priority, dueDate: extras.dueDate ?? addDays(7), source: extras.source ?? "manual", createdAt: new Date().toISOString() }]),
    addProject: (name, description, dueDate) => {
      const id = `proj-new-${++counter.current}`;
      setProjects((list) => [...list, { id, name, description, ownerId: currentUserId(), memberIds: [currentUserId()], dueDate }]);
      return id;
    },
  }), [projects, tasks]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return value;
}
