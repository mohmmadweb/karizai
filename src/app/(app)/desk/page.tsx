import type { Metadata } from "next";
import { ClientOnly } from "@/components/shared/client-only";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { DeskPageContent } from "@/features/desk/components/desk-page-content";

export const metadata: Metadata = { title: "میز کار من | کاریز" };

/** The desk shows today's date and events, so it is drawn in the browser. */
export default function DeskPage() {
  return <ClientOnly fallback={<ListSkeleton title="میز کار من" />}><DeskPageContent /></ClientOnly>;
}
