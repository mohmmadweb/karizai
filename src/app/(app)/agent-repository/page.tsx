import type { Metadata } from "next";
import { AgentRepositoryPageContent } from "@/features/agent-repository/components/agent-repository-page-content";

export const metadata: Metadata = { title: "مخزن عامل‌ها | کاریز" };

export default function AgentRepositoryPage() {
  return <AgentRepositoryPageContent />;
}
