import { MotoCard } from "@/components/shared/moto/moto";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Project, Task, TaskStatus } from "../types";
import { TaskRow } from "./task-row";

const order: TaskStatus[] = ["todo", "doing", "done"];

/** Tasks in one table, not started first, then in progress, then done. */
export function TaskList({ tasks, projects }: { tasks: Task[]; projects?: Project[] }) {
  if (tasks.length === 0) return <p className="py-6 text-center text-body text-muted-foreground">وظیفه‌ای نیست.</p>;
  const sorted = order.flatMap((status) => tasks.filter((task) => task.status === status));
  return (
    <MotoCard className="gap-0 overflow-hidden p-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>وظیفه</TableHead><TableHead className="hidden md:table-cell">منبع</TableHead><TableHead>اولویت</TableHead><TableHead className="hidden sm:table-cell">مسئول</TableHead><TableHead className="hidden md:table-cell">موعد</TableHead><TableHead>وضعیت</TableHead></TableRow></TableHeader>
          <TableBody>{sorted.map((task) => <TaskRow key={task.id} task={task} projectName={projects?.find((p) => p.id === task.projectId)?.name} />)}</TableBody>
        </Table>
      </div>
      <p className="border-t px-5 py-3 text-caption text-muted-foreground">نمایش {tasks.length.toLocaleString("fa-IR")} آیتم</p>
    </MotoCard>
  );
}
