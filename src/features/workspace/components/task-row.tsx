"use client";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { personName } from "../lib/people";
import { priorityLabels, sourceLabels, statusLabels, type Task, type TaskStatus } from "../types";
import { useWorkspace } from "./workspace-provider";

const statusItems = (Object.keys(statusLabels) as TaskStatus[]).map((value) => ({ value, label: statusLabels[value] }));

/** One task: title, who it is for, when it is due, its priority, and a menu to change its status. */
export function TaskRow({ task, projectName }: { task: Task; projectName?: string }) {
  const { setStatus } = useWorkspace();
  const done = task.status === "done";
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border bg-card p-3">
      <div className="flex min-w-0 flex-1 basis-56 flex-col gap-0.5">
        <span className={cn("font-medium", done && "text-muted-foreground line-through")}>{task.title}</span>
        <span className="text-caption text-muted-foreground">{projectName ? `${projectName} · ` : ""}موعد: {formatDate(task.dueDate)}{task.createdAt ? <> · ثبت‌شده: <time dateTime={task.createdAt} className="tabular-nums">{formatDate(task.createdAt, { dateStyle: "medium", timeStyle: "medium" })}</time></> : null}</span>
      </div>
      <span className="flex items-center gap-1.5 text-caption text-muted-foreground">منبع<Badge variant={(task.source ?? "manual") === "manual" ? "outline" : "info"}>{task.sourceName ?? sourceLabels[task.source ?? "manual"]}</Badge></span>
      <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>{priorityLabels[task.priority]}</Badge>
      <span className="flex items-center gap-2 text-body-sm text-muted-foreground"><PersonAvatar seed={task.assigneeId} name={personName(task.assigneeId)} className="size-6" />{personName(task.assigneeId)}</span>
      <Select items={statusItems} value={task.status} onValueChange={(next) => next && setStatus(task.id, next as TaskStatus)}>
        <SelectTrigger aria-label={`وضعیت «${task.title}»`} className="w-36"><SelectValue /></SelectTrigger>
        <SelectContent><SelectGroup>{statusItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
      </Select>
    </li>
  );
}
