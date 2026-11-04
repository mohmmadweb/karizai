"use client";
import { CodeText } from "@/components/shared/code-text";

import { TableCell, TableRow } from "@/components/ui/table";
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
    <TableRow className="h-[60px]">
      <TableCell className="whitespace-normal">
        <span className="flex flex-col gap-0.5">
          <span className={cn("font-medium", done && "text-muted-foreground line-through")}><CodeText>{task.title}</CodeText></span>
          {projectName ? <span className="text-caption text-muted-foreground">{projectName}</span> : null}
          {task.createdAt ? <span className="text-caption text-muted-foreground">ثبت‌شده: <time dateTime={task.createdAt} className="tabular-nums">{formatDate(task.createdAt, { dateStyle: "medium", timeStyle: "medium" })}</time></span> : null}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell"><Badge variant={(task.source ?? "manual") === "manual" ? "outline" : "info"}>{task.sourceName ?? sourceLabels[task.source ?? "manual"]}</Badge></TableCell>
      <TableCell><Badge variant={task.priority === "high" ? "destructive" : "secondary"}>{priorityLabels[task.priority]}</Badge></TableCell>
      <TableCell className="hidden sm:table-cell"><span className="flex items-center gap-2 text-body-sm"><PersonAvatar seed={task.assigneeId} name={personName(task.assigneeId)} className="size-7" />{personName(task.assigneeId)}</span></TableCell>
      <TableCell className="hidden text-body-sm text-muted-foreground md:table-cell">{formatDate(task.dueDate)}</TableCell>
      <TableCell>
        <Select items={statusItems} value={task.status} onValueChange={(next) => next && setStatus(task.id, next as TaskStatus)}>
          <SelectTrigger aria-label={`وضعیت «${task.title}»`} className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{statusItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
}
