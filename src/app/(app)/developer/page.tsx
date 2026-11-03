import type { Metadata } from "next";
import { DeveloperPageContent } from "@/features/developer/components/developer-page-content";

export const metadata: Metadata = { title: "توسعه‌دهندگان و API | کاریز" };

export default function DeveloperPage() {
  return <DeveloperPageContent />;
}
