import type { Metadata } from "next";
import { EvaluationsPageContent } from "@/admin/features/evaluations/components/evaluations-page-content";

export const metadata: Metadata = { title: "ارزیابی عامل‌ها | کاریز" };

export default function EvaluationsPage() {
  return <EvaluationsPageContent />;
}
