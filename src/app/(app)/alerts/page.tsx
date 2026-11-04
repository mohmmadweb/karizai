import type { Metadata } from "next";
import { AlertsPageContent } from "@/features/alerts/components/alerts-page-content";

export const metadata: Metadata = { title: "هشدارها و گزارش‌ها | کاریز" };

export default function AlertsPage() {
  return <AlertsPageContent />;
}
