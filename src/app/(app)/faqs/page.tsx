import type { Metadata } from "next";
import { FaqsPageContent } from "@/features/content/components/faqs-page-content";

export const metadata: Metadata = { title: "سوالات متداول | کاریز" };

export default function Page() {
  return <FaqsPageContent />;
}
