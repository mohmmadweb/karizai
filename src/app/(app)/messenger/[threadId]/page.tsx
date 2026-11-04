import type { Metadata } from "next";
import { ThreadView } from "@/features/messenger/components/thread-view";

export const metadata: Metadata = { title: "پیام‌رسان | کاریز" };

export default async function MessengerThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  return <ThreadView threadId={threadId} />;
}
