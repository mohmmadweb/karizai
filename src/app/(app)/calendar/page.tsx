import type { Metadata } from "next";
import { CalendarPageContent } from "@/features/desk/components/calendar-page-content";

export const metadata: Metadata = { title: "تقویم کاری | موشکاف" };

export default function CalendarPage() {
  return <CalendarPageContent />;
}
