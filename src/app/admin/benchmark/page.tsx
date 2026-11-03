import type { Metadata } from "next";
import { BenchmarkPageContent } from "@/admin/features/benchmark/components/benchmark-page-content";

export const metadata: Metadata = { title: "آزمون مقایسه‌ای | کاریز" };

export default function BenchmarkPage() {
  return <BenchmarkPageContent />;
}
