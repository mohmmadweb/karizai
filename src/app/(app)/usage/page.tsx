import type { Metadata } from "next";
import { UsagePageContent } from "@/features/usage/components/usage-page-content";

export const metadata: Metadata = { title: "مصرف من | کاریز" };

export default function UsagePage() {
  return <UsagePageContent />;
}
