import type { Metadata } from "next";
import { ClientOnly } from "@/components/shared/client-only";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { EventsPageContent } from "@/features/content/components/events-page-content";

export const metadata: Metadata = { title: "رویدادها و جلسات | کاریز" };

/** Statuses depend on today's date, so the page is drawn in the browser. */
export default function Page() {
  return <ClientOnly fallback={<ListSkeleton title="رویدادها و جلسات" />}><EventsPageContent /></ClientOnly>;
}
