import type { Metadata } from "next";
import { AgentsPageContent } from "@/features/agents/components/agents-page-content";

export const metadata: Metadata = { title: "عامل‌های من | کاریز" };

export default function AgentsPage() {
  return <AgentsPageContent />;
}
