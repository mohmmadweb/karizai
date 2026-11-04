import type { Metadata } from "next";
import { SupportPageContent } from "@/features/content/components/support-page-content";

export const metadata: Metadata = { title: "تیکت پشتیبانی | کاریز" };

export default function Page() {
  return <SupportPageContent />;
}
