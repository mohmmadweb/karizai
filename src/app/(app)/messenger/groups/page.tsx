import type { Metadata } from "next";
import { GroupsPageContent } from "@/features/social/groups/groups-page-content";

export const metadata: Metadata = { title: "گروه‌ها | کاریز" };

export default function Page() {
  return (
    <GroupsPageContent />
  );
}
