import type { Metadata } from "next";
import { ProjectSettingsPageContent } from "@/features/content/components/project-settings-page-content";

export const metadata: Metadata = { title: "تنظیمات پروژه | کاریز" };

export default function Page() {
  return <ProjectSettingsPageContent />;
}
