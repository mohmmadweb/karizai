import type { Metadata } from "next";
import { ForumsPageContent } from "@/features/content/components/forums-page-content";

export const metadata: Metadata = { title: "پرسش و پاسخ | کاریز" };

export default function Page() {
  return <ForumsPageContent />;
}
