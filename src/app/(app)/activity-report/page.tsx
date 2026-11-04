import type { Metadata } from "next";
import { ActivityReportPageContent } from "@/features/content/components/activity-report-page-content";

export const metadata: Metadata = { title: "گزارش فعالیت‌های من | کاریز" };

export default function Page() {
  return <ActivityReportPageContent />;
}
