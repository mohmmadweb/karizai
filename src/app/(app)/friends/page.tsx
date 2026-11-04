import type { Metadata } from "next";
import { FriendsPageContent } from "@/features/content/components/friends-page-content";

export const metadata: Metadata = { title: "ارتباطات من | کاریز" };

export default function Page() {
  return <FriendsPageContent />;
}
