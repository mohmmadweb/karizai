import type { Metadata } from "next";
import { WorkflowsPageContent } from "@/features/workflows/components/workflows-page-content";

export const metadata: Metadata = { title: "جریان‌ها | کاریز" };

export default function WorkflowsPage() {
  return <WorkflowsPageContent />;
}
