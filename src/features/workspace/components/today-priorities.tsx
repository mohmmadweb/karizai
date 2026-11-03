"use client";

import { formatNumber } from "@/lib/format";
import { daysFromToday } from "../lib/today";
import type { Project, Task } from "../types";

function reason(task: Task): string {
  const days = daysFromToday(task.dueDate);
  const parts = [days < 0 ? `${formatNumber(-days)} روز از موعد گذشته` : days === 0 ? "موعد امروز" : `${formatNumber(days)} روز تا موعد`];
  if (task.source === "reorder-flow") parts.push("جریان سفارش مواد منتظر تأیید شماست");
  if (task.source === "quality-agent") parts.push("بچ مردود پیش از ارسال باید اصلاح شود");
  if (task.priority === "high") parts.push("فوری");
  if (task.status === "doing") parts.push("در حال انجام");
  return parts.join(" · ");
}

const score = (task: Task) => daysFromToday(task.dueDate) * 2 - (task.priority === "high" ? 6 : task.priority === "low" ? -3 : 0) - (task.source === "reorder-flow" ? 4 : 0);

/** «✦ اولویت‌بندی امروز من»: the user's open tasks in the order to do them, each with its reason. */
export function TodayPriorities({ tasks, projects }: { tasks: Task[]; projects: Project[] }) {
  const ordered = tasks.filter((task) => task.status !== "done").sort((a, b) => score(a) - score(b)).slice(0, 5);
  if (ordered.length === 0) return <p>وظیفه‌ی بازی ندارید.</p>;
  return (
    <ol className="flex flex-col gap-2">
      {ordered.map((task, index) => (
        <li key={task.id} className="flex gap-3 rounded-lg border bg-card p-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-caption text-primary-foreground">{formatNumber(index + 1)}</span>
          <span className="flex flex-col"><span className="text-label">{task.title}</span><span className="text-caption text-muted-foreground">{projects.find((p) => p.id === task.projectId)?.name} · {reason(task)}</span></span>
        </li>
      ))}
    </ol>
  );
}
