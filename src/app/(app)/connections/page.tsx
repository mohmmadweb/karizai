import type { Metadata } from "next";
import { ConnectionsPageContent } from "@/features/connections/components/connections-page-content";

export const metadata: Metadata = { title: "اتصال‌ها | کاریز" };

export default function ConnectionsPage() {
  return <ConnectionsPageContent />;
}
