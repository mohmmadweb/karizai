"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import { taskFromStep } from "@/features/workflows/lib/task-step";
import { currentUserId } from "../lib/people";
import { getProjects, getTasks } from "../data/workspace";
import type { Project, Task, TaskPriority, TaskStatus } from "../types";

type WorkspaceContextValue = {
  projects: Project[];
  tasks: Task[];
  setStatus: (taskId: string, status: TaskStatus) => void;
  /** Adds a task for the current user; it stays only until the page is reloaded. */
  addTask: (projectId: string, title: string, assigneeId: string, priority?: TaskPriority) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

/** Projects and tasks of the workspace, in memory. */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
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
        setTasks((list) => [...list, { id, projectId: project.id, title: wanted.title, assigneeId: currentUserId(), status: "todo", priority: wanted.priority, dueDate: new Date(Date.now() + 3 * 864e5).toISOString() }]);
        toast.success("وظیفه‌ی تازه ثبت شد", { description: `«${wanted.title}» در «فعالیت و وظایف من» ثبت شد.`, action: { label: "دیدن وظایف", onClick: () => router.push("/messenger/tasks") } });
      }
    }
  }, [runs, workflows, knownRunIds, router]);
  const value = useMemo<WorkspaceContextValue>(() => ({
    projects: getProjects(),
    tasks,
    setStatus: (taskId, status) => setTasks((list) => list.map((task) => (task.id === taskId ? { ...task, status } : task))),
    addTask: (projectId, title, assigneeId, priority = "normal") => setTasks((list) => [...list, { id: `task-new-${++counter.current}`, projectId, title, assigneeId, status: "todo", priority, dueDate: new Date(Date.now() + 7 * 864e5).toISOString() }]),
  }), [tasks]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return value;
}
