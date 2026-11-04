import type { Metadata } from "next";
import { BlogsPageContent } from "@/features/content/components/blogs-page-content";

export const metadata: Metadata = { title: "وبلاگ‌ها | کاریز" };

export default function Page() {
  return <BlogsPageContent />;
}
