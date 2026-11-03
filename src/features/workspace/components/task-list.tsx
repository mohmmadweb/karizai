import { statusLabels, type Project, type Task, type TaskStatus } from "../types";
import { TaskRow } from "./task-row";

const order: TaskStatus[] = ["todo", "doing", "done"];

/** Tasks in three groups: not started, in progress, done. */
export function TaskList({ tasks, projects }: { tasks: Task[]; projects?: Project[] }) {
  if (tasks.length === 0) return <p className="py-6 text-center text-body text-muted-foreground">وظیفه‌ای نیست.</p>;
  return (
    <div className="flex flex-col gap-6">
      {order.map((status) => {
        const group = tasks.filter((task) => task.status === status);
        if (group.length === 0) return null;
        return (
          <section key={status} aria-label={statusLabels[status]} className="flex flex-col gap-3">
            <h2 className="text-h4">{statusLabels[status]} <span className="text-body-sm text-muted-foreground">({group.length.toLocaleString("fa-IR")})</span></h2>
            <ul className="flex flex-col gap-2">{group.map((task) => <TaskRow key={task.id} task={task} projectName={projects?.find((p) => p.id === task.projectId)?.name} />)}</ul>
          </section>
        );
      })}
    </div>
  );
}
