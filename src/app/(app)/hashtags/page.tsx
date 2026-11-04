import type { Metadata } from "next";
import { HashtagsPageContent } from "@/features/content/components/hashtags-page-content";

export const metadata: Metadata = { title: "هشتگ‌ها | کاریز" };

export default function Page() {
  return <HashtagsPageContent />;
}
