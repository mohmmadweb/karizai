import type { Metadata } from "next";
import { ThreadView } from "@/features/messenger/components/thread-view";
import { alertsThreadId } from "@/features/messenger/types";

export const metadata: Metadata = { title: "پیام‌رسان | موشکاف" };

export default function MessengerPage() {
  return <ThreadView threadId={alertsThreadId} />;
}
