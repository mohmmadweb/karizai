import type { Metadata } from "next";
import { PoliciesPageContent } from "@/admin/features/policies/components/policies-page-content";

export const metadata: Metadata = { title: "سیاست‌ها | کاریز" };

export default function PoliciesPage() {
  return <PoliciesPageContent />;
}
