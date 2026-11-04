import type { Metadata } from "next";
import { ChannelsPageContent } from "@/features/social/channels/channels-page-content";

export const metadata: Metadata = { title: "کانال‌ها | کاریز" };

export default function Page() {
  return (
    <ChannelsPageContent />
  );
}
