import type { Metadata } from "next";
import { LivePageContent } from "@/features/live/components/live-page-content";

export const metadata: Metadata = { title: "فعالیت زنده | کاریز" };

export default function LivePage() {
  return <LivePageContent />;
}
