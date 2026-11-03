"use client";

import { CalendarDaysIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { currentUserId } from "@/features/workspace/lib/people";
import { formatDate } from "@/lib/format";

/** My work by date: open tasks and project deadlines, earliest first. */
export function CalendarPageContent() {
  const { tasks, projects } = useWorkspace();
  const entries = [
    ...tasks.filter((task) => task.assigneeId === currentUserId() && task.status !== "done").map((task) => ({ id: task.id, date: task.dueDate, title: task.title, kind: "وظیفه" })),
    ...projects.filter((project) => project.memberIds.includes(currentUserId()) || project.ownerId === currentUserId()).map((project) => ({ id: project.id, date: project.dueDate, title: project.name, kind: "پایان پروژه" })),
  ].sort((a, b) => a.date.localeCompare(b.date));
  const days = [...new Set(entries.map((entry) => entry.date.slice(0, 10)))];
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="تقویم کاری" description="موعد وظایف و پایان پروژه‌های شما، از نزدیک‌ترین." />
      {entries.length === 0 ? (
        <EmptyState icon={<CalendarDaysIcon />} title="موعدی در پیش ندارید" description="با ثبت وظیفه یا پروژه‌ی تازه، موعدشان اینجا می‌آید." />
      ) : (
        <ol className="flex flex-col gap-4">
          {days.map((day) => (
            <li key={day} className="flex flex-col gap-2">
              <h2 className="text-label text-muted-foreground">{formatDate(day)}</h2>
              <ul className="flex flex-col gap-2">
                {entries.filter((entry) => entry.date.slice(0, 10) === day).map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3"><span>{entry.title}</span><span className="text-caption text-muted-foreground">{entry.kind}</span></li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
