import type { Metadata } from "next";
import { UsagePageContent } from "@/features/usage/components/usage-page-content";

export const metadata: Metadata = { title: "مصرف من | موشکاف" };

export default function UsagePage() {
  return <UsagePageContent />;
}
