import type { Metadata } from "next";
import { ProjectDetail } from "@/features/workspace/components/project-detail";

export const metadata: Metadata = { title: "پروژه | موشکاف" };

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <ProjectDetail projectId={projectId} />;
}
