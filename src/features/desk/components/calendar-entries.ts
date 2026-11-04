import type { CalendarEvent } from "@/features/social/types";
import type { Task } from "@/features/workspace/types";

export type CalendarEntry = { id: string; date: string; title: string; kind: "event" | "task" | "project" | "suggestion"; time?: string; assistant?: string; /** Set for entries that come from the shared calendar, so they can be opened. */ eventId?: string };

/** Everything that has a date in my calendar: events (booked ones included), my open tasks and project ends. */
export function buildEntries(input: { events: CalendarEvent[]; tasks: Task[]; projects: { id: string; name: string; dueDate: string }[] }): CalendarEntry[] {
  return [
    ...input.events.map((event): CalendarEntry => ({
      id: event.id, date: event.start, title: event.title, kind: event.suggested ? "suggestion" : "event", time: event.start, eventId: event.id,
      assistant: event.agenda ? "دستور جلسه" : event.hasMinutes ? "صورت‌جلسه و وظایف" : undefined,
    })),
    ...input.tasks.map((task): CalendarEntry => ({ id: task.id, date: task.dueDate, title: task.title, kind: "task" })),
    ...input.projects.map((project): CalendarEntry => ({ id: project.id, date: project.dueDate, title: project.name, kind: "project" })),
  ].sort((a, b) => a.date.localeCompare(b.date));
}

export const kindLabels: Record<CalendarEntry["kind"], string> = { event: "رویداد", task: "وظیفه", project: "پایان پروژه", suggestion: "پیشنهاد دستیار" };
