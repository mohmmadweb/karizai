import Link from "@/components/shared/app-link";
import { CalendarIcon, MoreVerticalIcon, UsersIcon } from "lucide-react";
import { CardViewButton, MotoCard } from "@/components/shared/moto/moto";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { hasProjectPage } from "../data/workspace";
import { personName } from "../lib/people";
import { projectStatus } from "../lib/project-status";
import { daysFromToday } from "../lib/today";
import type { Project, Task } from "../types";
import { ProjectAiActions, RiskChip } from "./project-ai-actions";

/** One project: progress from the tasks, the assistant's delay risk, members, due date and AI actions. Only sample projects link to a page. */
export function ProjectCard({ project, tasks }: { project: Project; tasks: Task[] }) {
  const status = projectStatus(project, tasks);
  const linked = hasProjectPage(project.id);
  const days = daysFromToday(project.dueDate);
  const finished = status.percent === 100;
  return (
    <MotoCard className="h-full">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-h4">{project.name}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger render={<button type="button" aria-label={`گزینه‌های ${project.name}`} className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50" />}><MoreVerticalIcon className="size-4" aria-hidden /></DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-40">
            {linked ? <DropdownMenuItem render={<Link href={`/messenger/projects/${project.id}`} />}>مشاهده‌ی پروژه</DropdownMenuItem> : <DropdownMenuItem disabled>صفحه‌ی جداگانه ندارد</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-body-sm text-muted-foreground">{project.description}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-body-sm"><span>پیشرفت</span><span className="text-muted-foreground">{formatNumber(status.percent)}٪</span></div>
        <Progress value={status.percent} aria-label={`پیشرفت ${project.name}`} />
        <span className="text-caption text-muted-foreground">{formatNumber(status.done)} از {formatNumber(status.done + status.open)} وظیفه انجام شده</span>
      </div>
      <div className="flex flex-wrap gap-1.5"><RiskChip risk={status.insight.risk} /></div>
      <div className="flex flex-col gap-2 border-t pt-3 text-body-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1"><CalendarIcon className="size-4" aria-hidden />تا {formatDate(project.dueDate)}</span>
          <span className="flex items-center gap-1"><UsersIcon className="size-4" aria-hidden />{formatNumber(project.memberIds.length)} عضو</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <ul className="flex -space-x-2 rtl:space-x-reverse" aria-label="اعضا">
            {project.memberIds.map((id) => <li key={id} title={personName(id)}><PersonAvatar seed={id} name={personName(id)} className="size-7 ring-2 ring-card" /></li>)}
          </ul>
          {finished ? <span className="text-caption text-emerald-600">تکمیل‌شده</span> : <span className={cn("text-caption font-medium", days >= 0 ? "text-emerald-600" : "text-destructive")}>{days >= 0 ? `${formatNumber(days)} روز تا پایان` : `${formatNumber(-days)} روز تأخیر`}</span>}
        </div>
      </div>
      <ProjectAiActions project={project} status={status} />
      {linked ? <CardViewButton href={`/messenger/projects/${project.id}`}>مشاهده</CardViewButton> : null}
    </MotoCard>
  );
}
