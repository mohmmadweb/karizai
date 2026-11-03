import type { Metadata } from "next";
import { DeskPageContent } from "@/features/desk/components/desk-page-content";

export const metadata: Metadata = { title: "میز کار | موشکاف" };

export default function DeskPage() {
  return <DeskPageContent />;
}
