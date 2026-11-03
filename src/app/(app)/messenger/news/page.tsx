import type { Metadata } from "next";
import { NewsPageContent } from "@/features/social/news/news-page-content";

export const metadata: Metadata = { title: "اخبار سازمان | کاریز" };

export default function Page() {
  return <NewsPageContent />;
}
