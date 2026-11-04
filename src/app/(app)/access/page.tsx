import type { Metadata } from "next";
import { AccessPageContent } from "@/features/content/components/access-page-content";

export const metadata: Metadata = { title: "نقش و دسترسی من | کاریز" };

export default function Page() {
  return <AccessPageContent />;
}
