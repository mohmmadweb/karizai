import type { Metadata } from "next";
import { ProjectDetail } from "@/features/workspace/components/project-detail";
import { getProjects } from "@/features/workspace/data/workspace";
import { toParams } from "@/lib/static-params";

export const metadata: Metadata = { title: "پروژه | کاریز" };

export function generateStaticParams() {
  return toParams("projectId", getProjects().map((item) => item.id));
}

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <ProjectDetail projectId={projectId} />;
}
