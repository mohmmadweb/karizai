import type { Metadata } from "next";
import { ApprovalsPageContent } from "@/admin/features/approvals/components/approvals-page-content";

export const metadata: Metadata = { title: "صف تأیید | کاریز" };

export default function ApprovalsPage() {
  return <ApprovalsPageContent />;
}
