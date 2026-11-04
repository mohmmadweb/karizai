import type { Task } from "@/features/workspace/types";
import type { DeskEvent } from "../data/events";

export type CalendarEntry = { id: string; date: string; title: string; kind: "event" | "task" | "project" | "suggestion"; time?: string; assistant?: string };

/** Everything that has a date in my calendar: events, my open tasks, project ends and assistant suggestions. */
export function buildEntries(input: { events: DeskEvent[]; tasks: Task[]; projects: { id: string; name: string; dueDate: string }[]; suggestions: CalendarEntry[] }): CalendarEntry[] {
  return [
    ...input.events.map((event): CalendarEntry => ({ id: event.id, date: event.startsAt, title: event.title, kind: "event", time: event.startsAt, assistant: event.assistant?.label })),
    ...input.tasks.map((task): CalendarEntry => ({ id: task.id, date: task.dueDate, title: task.title, kind: "task" })),
    ...input.projects.map((project): CalendarEntry => ({ id: project.id, date: project.dueDate, title: project.name, kind: "project" })),
    ...input.suggestions,
  ].sort((a, b) => a.date.localeCompare(b.date));
}

export const kindLabels: Record<CalendarEntry["kind"], string> = { event: "رویداد", task: "وظیفه", project: "پایان پروژه", suggestion: "پیشنهاد دستیار" };
