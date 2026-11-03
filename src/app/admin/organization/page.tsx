import type { Metadata } from "next";
import { OrganizationPageContent } from "@/admin/features/organization/components/organization-page-content";

export const metadata: Metadata = { title: "ساختار و نقش‌ها | کاریز" };

export default function OrganizationPage() {
  return <OrganizationPageContent />;
}
