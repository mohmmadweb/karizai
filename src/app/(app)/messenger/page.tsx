import type { Metadata } from "next";
import { MessengerHome } from "@/features/messenger/components/messenger-home";

export const metadata: Metadata = { title: "پیام‌رسان | کاریز" };

/** The messenger shows the chat list; a chat opens from it. */
export default function MessengerPage() {
  return <MessengerHome />;
}
