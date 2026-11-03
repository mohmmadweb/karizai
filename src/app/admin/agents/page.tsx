import type { Metadata } from "next";
import { AgentsAdminContent } from "@/admin/features/agents/components/agents-page-content";

export const metadata: Metadata = { title: "عامل‌ها | کاریز" };

export default function AdminAgentsPage() {
  return <AgentsAdminContent />;
}
