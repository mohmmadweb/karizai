import type { Metadata } from "next";
import { SkillsPageContent } from "@/features/skills/components/skills-page-content";

export const metadata: Metadata = { title: "اسکیل‌های من | موشکاف" };

export default function SkillsPage() {
  return <SkillsPageContent />;
}
