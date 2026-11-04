import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { CalendarPageContent } from "@/features/desk/components/calendar-page-content";

export const metadata: Metadata = { title: "تقویم کاری من | موشکاف" };

/** The calendar is drawn around today's date, so it is built on each visit, not at build time. */
async function Today() {
  await connection();
  return <CalendarPageContent />;
}

export default function CalendarPage() {
  return <Suspense fallback={null}><Today /></Suspense>;
}
