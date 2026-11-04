import type { Metadata } from "next";
import { AgentsPageContent } from "@/features/agents/components/agents-page-content";

export const metadata: Metadata = { title: "Agentهای من | کاریز" };

export default function AgentsPage() {
  return <AgentsPageContent />;
}
