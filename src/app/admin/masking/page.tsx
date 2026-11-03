import type { Metadata } from "next";
import { MaskingPageContent } from "@/admin/features/masking/components/masking-page-content";

export const metadata: Metadata = { title: "پوشاندن داده | کاریز" };

export default function MaskingPage() {
  return <MaskingPageContent />;
}
