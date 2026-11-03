import type { Metadata } from "next";
import { WebhooksPageContent } from "@/admin/features/webhooks/components/webhooks-page-content";

export const metadata: Metadata = { title: "وب‌هوک‌ها | کاریز" };

export default function WebhooksPage() {
  return <WebhooksPageContent />;
}
