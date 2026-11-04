import type { Metadata } from "next";
import { MediaPageContent } from "@/features/content/components/media-page-content";

export const metadata: Metadata = { title: "رسانه | کاریز" };

export default function Page() {
  return <MediaPageContent />;
}
