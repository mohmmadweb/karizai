"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { currentUserId } from "../lib/people";
import { addDays } from "../lib/today";
import { getProjects, getTasks } from "../data/workspace";
import type { Project, Task, TaskPriority, TaskSource, TaskStatus } from "../types";

type TaskExtras = { source?: TaskSource; dueDate?: string; /** Shown instead of the source label, for example «✦ جریان برنامه‌ریزی تولید». */ sourceName?: string };

type WorkspaceContextValue = {
  projects: Project[];
  tasks: Task[];
  setStatus: (taskId: string, status: TaskStatus) => void;
  /** Adds a task and returns its id; it stays only until the page is reloaded. Without a source it counts as made by hand. */
  addTask: (projectId: string, title: string, assigneeId: string, priority?: TaskPriority, extras?: TaskExtras) => string;
  /** Adds a project for the current user and returns its id; it has no page of its own (see `hasProjectPage`). */
  addProject: (name: string, description: string, dueDate: string) => string;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

/** Projects and tasks of the workspace, in memory. Tasks that workflow steps register come from the live effects engine (`features/live`). */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState(getProjects);
  const [tasks, setTasks] = useState(getTasks);
  const counter = useRef(0);
  const value = useMemo<WorkspaceContextValue>(() => ({
    projects,
    tasks,
    setStatus: (taskId, status) => setTasks((list) => list.map((task) => (task.id === taskId ? { ...task, status } : task))),
    addTask: (projectId, title, assigneeId, priority = "normal", extras = {}) => {
      const id = `task-new-${++counter.current}`;
      setTasks((list) => [...list, { id, projectId, title, assigneeId, status: "todo", priority, dueDate: extras.dueDate ?? addDays(7), source: extras.source ?? "manual", sourceName: extras.sourceName, createdAt: new Date().toISOString() }]);
      return id;
    },
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
