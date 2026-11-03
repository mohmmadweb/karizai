"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ProjectCard } from "./project-card";
import { useWorkspace } from "./workspace-provider";

export function ProjectsPageContent() {
  const { projects, tasks } = useWorkspace();
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="پروژه‌ها" description="پروژه‌های سازمان با پیشرفت، اعضا و موعد. روی هر پروژه بزنید تا وظایفش را ببینید." />
      <ul className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => <li key={project.id} className="relative"><ProjectCard project={project} tasks={tasks.filter((t) => t.projectId === project.id)} /></li>)}
      </ul>
    </div>
  );
}
