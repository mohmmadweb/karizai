import type { Metadata } from "next";
import { StatusPageContent } from "@/admin/features/status/components/status-page-content";

export const metadata: Metadata = { title: "وضعیت و SLA | کاریز" };

export default function StatusPage() {
  return <StatusPageContent />;
}
