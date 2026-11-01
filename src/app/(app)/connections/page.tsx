import type { Metadata } from "next";
import { ConnectionsPageContent } from "@/features/connections/components/connections-page-content";

export const metadata: Metadata = { title: "اتصال‌ها | موشکاف" };

export default function ConnectionsPage() {
  return <ConnectionsPageContent />;
}
