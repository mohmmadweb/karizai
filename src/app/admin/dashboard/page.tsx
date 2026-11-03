import type { Metadata } from "next";
import { DashboardPageContent } from "@/admin/features/admin-dashboard/components/dashboard-page-content";

export const metadata: Metadata = { title: "داشبورد | کاریز" };

export default function DashboardPage() {
  return <DashboardPageContent />;
}
