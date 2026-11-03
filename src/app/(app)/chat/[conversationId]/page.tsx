import { ChatView } from "@/features/chat/components/chat-view";
import { getConversations } from "@/features/chat/data/conversations";
import { runtimeIds, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams("conversationId", [...getConversations().map((item) => item.id), ...runtimeIds("conv-new")]);
}

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  return <ChatView conversationId={conversationId} />;
}
