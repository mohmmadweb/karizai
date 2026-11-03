"use client";

import { BackLink } from "@/components/shared/back-link";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { PageHeader } from "@/components/shared/page-header";
import { TaskList } from "./task-list";
import { useWorkspace } from "./workspace-provider";

export function ProjectDetail({ projectId }: { projectId: string }) {
  const { projects, tasks } = useWorkspace();
  const project = projects.find((item) => item.id === projectId);
  if (!project) return <EntityNotFound title="پروژه پیدا نشد" backHref="/messenger/projects" backLabel="بازگشت به پروژه‌ها" />;
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <BackLink href="/messenger/projects">پروژه‌ها</BackLink>
      <PageHeader title={project.name} description={project.description} />
      <TaskList tasks={tasks.filter((task) => task.projectId === project.id)} />
    </div>
  );
}
