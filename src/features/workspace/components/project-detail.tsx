"use client";

import { BackLink } from "@/components/shared/back-link";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { MotoPage } from "@/components/shared/moto/moto";
import { PageHeader } from "@/components/shared/page-header";
import { projectStatus } from "../lib/project-status";
import { ProjectAiActions, RiskChip } from "./project-ai-actions";
import { TaskList } from "./task-list";
import { useWorkspace } from "./workspace-provider";

export function ProjectDetail({ projectId }: { projectId: string }) {
  const { projects, tasks } = useWorkspace();
  const project = projects.find((item) => item.id === projectId);
  if (!project) return <EntityNotFound title="پروژه پیدا نشد" backHref="/messenger/projects" backLabel="بازگشت به پروژه‌ها" />;
  return (
    <MotoPage className="gap-8">
      <BackLink href="/messenger/projects">پروژه‌ها</BackLink>
      <PageHeader title={project.name} description={project.description} action={<RiskChip risk={projectStatus(project, tasks).insight.risk} />} />
      <ProjectAiActions project={project} status={projectStatus(project, tasks)} />
      <TaskList tasks={tasks.filter((task) => task.projectId === project.id)} />
    </MotoPage>
  );
}
