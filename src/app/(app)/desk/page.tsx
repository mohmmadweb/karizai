import type { Metadata } from "next";
import { DeskPageContent } from "@/features/social/desk/desk-page-content";

export const metadata: Metadata = { title: "میز کار من | کاریز" };

export default function DeskPage() {
  return <DeskPageContent />;
}
