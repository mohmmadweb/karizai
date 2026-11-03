import type { Metadata } from "next";
import { MembersPageContent } from "@/features/social/members/members-page-content";

export const metadata: Metadata = { title: "اعضای سازمان | کاریز" };

export default function Page() {
  return <MembersPageContent />;
}
