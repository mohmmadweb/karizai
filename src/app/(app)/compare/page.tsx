import type { Metadata } from "next";
import { ComparePageContent } from "@/features/model-compare/components/compare-page-content";

export const metadata: Metadata = { title: "مقایسه‌ی مدل‌ها | کاریز" };

export default function ComparePage() {
  return <ComparePageContent />;
}
