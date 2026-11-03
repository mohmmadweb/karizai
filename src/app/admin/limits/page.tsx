import type { Metadata } from "next";
import { LimitsPageContent } from "@/admin/features/limits/components/limits-page-content";

export const metadata: Metadata = { title: "محدودیت نرخ | کاریز" };

export default function LimitsPage() {
  return <LimitsPageContent />;
}
