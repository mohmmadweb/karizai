import type { Metadata } from "next";
import { ClientOnly } from "@/components/shared/client-only";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { CalendarPageContent } from "@/features/desk/components/calendar-page-content";

export const metadata: Metadata = { title: "تقویم کاری من | کاریز" };

/** The calendar is drawn around today's date, so it is drawn in the browser. */
export default function CalendarPage() {
  return <ClientOnly fallback={<div className="page-gutter py-8"><ListSkeleton title="تقویم کاری من" /></div>}><CalendarPageContent /></ClientOnly>;
}
