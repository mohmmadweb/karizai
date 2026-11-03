import type { Metadata } from "next";
import { ThreadView } from "@/features/messenger/components/thread-view";
import { getBots } from "@/features/messenger/data/bots";
import { getColleagues } from "@/features/messenger/data/colleagues";
import { toParams } from "@/lib/static-params";

export const metadata: Metadata = { title: "پیام‌رسان | کاریز" };

export function generateStaticParams() {
  return toParams("threadId", [...getBots(), ...getColleagues()].map((item) => item.id));
}

export default async function MessengerThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  return <ThreadView threadId={threadId} />;
}
