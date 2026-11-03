import type { Metadata } from "next";
import { DataPageContent } from "@/features/data-analytics/components/data-page-content";

export const metadata: Metadata = { title: "داده و تحلیل | کاریز" };

export default function DataPage() {
  return <DataPageContent />;
}
