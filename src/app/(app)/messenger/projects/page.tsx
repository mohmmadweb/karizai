import type { Metadata } from "next";
import { ProjectsPageContent } from "@/features/workspace/components/projects-page-content";

export const metadata: Metadata = { title: "پروژه‌ها | موشکاف" };

export default function ProjectsPage() {
  return <ProjectsPageContent />;
}
