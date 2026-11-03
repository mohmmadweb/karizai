import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatNumber } from "@/lib/format";
import { personName } from "../lib/people";
import type { Project, Task } from "../types";

/** One project: its progress from the tasks, its members and its due date. */
export function ProjectCard({ project, tasks }: { project: Project; tasks: Task[] }) {
  const done = tasks.filter((task) => task.status === "done").length;
  const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle><Link href={`/messenger/projects/${project.id}`} className="rounded-sm outline-none after:absolute after:inset-0 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">{project.name}</Link></CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-body-sm"><span className="text-muted-foreground">{formatNumber(done)} از {formatNumber(tasks.length)} وظیفه انجام شده</span><span className="tabular-nums">{formatNumber(percent)}٪</span></div>
          <Progress value={percent} aria-label={`پیشرفت ${project.name}`} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <ul className="flex -space-x-2 rtl:space-x-reverse" aria-label="اعضا">
            {project.memberIds.map((id) => <li key={id} title={personName(id)}><PersonAvatar seed={id} name={personName(id)} className="size-8 ring-2 ring-card" /></li>)}
          </ul>
          <span className="flex items-center gap-1 text-body-sm text-muted-foreground"><CalendarIcon className="size-4" aria-hidden />{formatDate(project.dueDate)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
