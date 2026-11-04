import type { Metadata } from "next";
import { CategoriesPageContent } from "@/features/content/components/categories-page-content";

export const metadata: Metadata = { title: "دسته‌بندی‌ها | کاریز" };

export default function Page() {
  return <CategoriesPageContent />;
}
