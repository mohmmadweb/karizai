import type { Metadata } from "next";
import { CalendarPageContent } from "@/features/social/calendar/calendar-page-content";

export const metadata: Metadata = { title: "تقویم کاری من | کاریز" };

export default function CalendarPage() {
  return <CalendarPageContent />;
}
