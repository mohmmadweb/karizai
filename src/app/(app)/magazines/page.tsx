import type { Metadata } from "next";
import { MagazinesPageContent } from "@/features/content/components/magazines-page-content";

export const metadata: Metadata = { title: "مجلات | کاریز" };

export default function Page() {
  return <MagazinesPageContent />;
}
