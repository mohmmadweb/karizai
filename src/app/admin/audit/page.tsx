import type { Metadata } from "next";
import { AuditPageContent } from "@/admin/features/audit/components/audit-page-content";

export const metadata: Metadata = { title: "ممیزی | کاریز" };

export default function AuditPage() {
  return <AuditPageContent />;
}
