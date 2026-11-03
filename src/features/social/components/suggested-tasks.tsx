"use client";

import { useState } from "react";
import { CheckIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { personName } from "@/features/workspace/lib/people";
import type { TaskSource } from "@/features/workspace/types";
import { formatDate, formatNumber } from "@/lib/format";
import type { SuggestedTask } from "../types";

type SuggestedTasksProps = {
  tasks: SuggestedTask[];
  source: TaskSource;
  /** Label of the button that adds all of them, for example «افزودن به پروژه». */
  addAllLabel?: string;
  /** Shows an «افزودن به وظایف» button on each row. */
  perItem?: boolean;
  /** Puts every task in this project instead of the one the assistant chose. */
  projectId?: string;
  /** Toast text after «add all»; the default names the count. */
  doneMessage?: string;
  onAdded?: () => void;
};

/** Tasks the assistant found, each with its owner and due date, ready to be added to the workspace. */
export function SuggestedTasks({ tasks, source, addAllLabel = "افزودن همه به وظایف", perItem = false, projectId, doneMessage, onAdded }: SuggestedTasksProps) {
  const { addTask, projects } = useWorkspace();
  const [added, setAdded] = useState<number[]>([]);
  const remaining = tasks.map((_, index) => index).filter((index) => !added.includes(index));

  function add(indexes: number[]) {
    for (const index of indexes) {
      const task = tasks[index];
      addTask(projectId ?? task.projectId, task.title, task.assigneeId, "normal", { source, dueDate: task.dueDate });
    }
    setAdded((list) => [...list, ...indexes]);
    return indexes.length;
  }

  function addAll() {
    const count = add(remaining);
    const project = projects.find((item) => item.id === (projectId ?? tasks[0]?.projectId))?.name;
    toast.success(doneMessage ?? `${formatNumber(count)} وظیفه${project ? ` به پروژه‌ی «${project}»` : ""} اضافه و به مسئولان اعلان شد`);
    onAdded?.();
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {tasks.map((task, index) => (
          <li key={task.title} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border bg-card p-2.5">
            <PersonAvatar seed={task.assigneeId} name={personName(task.assigneeId)} className="size-7" />
            <span className="flex min-w-0 flex-1 basis-48 flex-col">
              <span className="text-body-sm font-medium">{task.title}</span>
              <span className="text-caption text-muted-foreground">{personName(task.assigneeId)} · موعد {formatDate(task.dueDate, { day: "numeric", month: "long", timeZone: "Asia/Tehran" })}</span>
            </span>
            {perItem ? (
              added.includes(index)
                ? <span className="flex items-center gap-1 text-caption text-success"><CheckIcon className="size-4" aria-hidden />اضافه شد</span>
                : <Button size="xs" variant="outline" onClick={() => { add([index]); toast.success(`«${task.title}» به وظایف اضافه شد`); }}><PlusIcon aria-hidden />افزودن به وظایف</Button>
            ) : null}
          </li>
        ))}
      </ul>
      {remaining.length > 0 ? (
        <Button size="sm" className="w-fit" onClick={addAll}>{addAllLabel}</Button>
      ) : (
        <p className="flex items-center gap-1.5 text-body-sm text-success"><CheckIcon className="size-4" aria-hidden />همه‌ی وظایف اضافه شد و در «فعالیت و وظایف من» دیده می‌شود.</p>
      )}
    </div>
  );
}
