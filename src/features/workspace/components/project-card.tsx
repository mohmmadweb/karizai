import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatNumber } from "@/lib/format";
import { hasProjectPage } from "../data/workspace";
import { personName } from "../lib/people";
import { projectStatus } from "../lib/project-status";
import type { Project, Task } from "../types";
import { ProjectAiActions, RiskChip } from "./project-ai-actions";

/** One project: progress from the tasks, the assistant's delay risk, members, due date and AI actions. Only sample projects link to a page. */
export function ProjectCard({ project, tasks }: { project: Project; tasks: Task[] }) {
  const status = projectStatus(project, tasks);
  const linked = hasProjectPage(project.id);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{linked ? <Link href={`/messenger/projects/${project.id}`} className="rounded-sm outline-none after:absolute after:inset-0 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">{project.name}</Link> : project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-body-sm"><span className="text-muted-foreground">{formatNumber(status.done)} از {formatNumber(status.done + status.open)} وظیفه انجام شده · {formatNumber(status.percent)}٪</span><RiskChip risk={status.insight.risk} /></div>
          <Progress value={status.percent} aria-label={`پیشرفت ${project.name}`} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <ul className="flex -space-x-2 rtl:space-x-reverse" aria-label="اعضا">
            {project.memberIds.map((id) => <li key={id} title={personName(id)}><PersonAvatar seed={id} name={personName(id)} className="size-8 ring-2 ring-card" /></li>)}
          </ul>
          <span className="flex items-center gap-1 text-body-sm text-muted-foreground"><CalendarIcon className="size-4" aria-hidden />{formatDate(project.dueDate)}</span>
        </div>
        <ProjectAiActions project={project} status={status} />
      </CardContent>
    </Card>
  );
}
