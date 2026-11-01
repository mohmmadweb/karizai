import type { Metadata } from "next";
import { WorkflowsPageContent } from "@/features/workflows/components/workflows-page-content";

export const metadata: Metadata = { title: "کارهای من | موشکاف" };

export default function WorkflowsPage() {
  return <WorkflowsPageContent />;
}
