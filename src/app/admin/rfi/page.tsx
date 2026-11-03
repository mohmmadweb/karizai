import type { Metadata } from "next";
import { RfiCoverageContent } from "@/admin/features/rfi/components/rfi-coverage-content";

export const metadata: Metadata = { title: "نقشه‌ی پوشش RFI | کاریز" };

export default function RfiPage() {
  return <RfiCoverageContent />;
}
