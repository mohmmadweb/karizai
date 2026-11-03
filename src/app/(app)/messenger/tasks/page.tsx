import type { Metadata } from "next";
import { TasksPageContent } from "@/features/workspace/components/tasks-page-content";

export const metadata: Metadata = { title: "فعالیت و وظایف من | کاریز" };

export default function TasksPage() {
  return <TasksPageContent />;
}
