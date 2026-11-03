import type { Metadata } from "next";
import { Suspense } from "react";
import { GroupsPageContent } from "@/features/social/groups/groups-page-content";

export const metadata: Metadata = { title: "گروه‌ها | کاریز" };

export default function Page() {
  return (
    <Suspense>
      <GroupsPageContent />
    </Suspense>
  );
}
