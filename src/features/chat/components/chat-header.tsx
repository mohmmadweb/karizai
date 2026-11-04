"use client";

import { Badge } from "@/components/ui/badge";
import { useAgents } from "@/features/agents/components/agents-provider";
import { ModelPicker } from "@/features/model-catalog/components/model-picker";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { useChat } from "./chat-provider";

/** Model choice at the top of the conversation, with the standing rule for sensitive data. */
export function ChatHeader({ conversationId }: { conversationId: string | null }) {
  const { state, updateSettings } = useChat();
  const { agents } = useAgents();
  const settings = state.conversations.find((item) => item.id === conversationId)?.settings ?? state.draft;
  const agent = agents.find((item) => item.id === settings.agentId);
  const { models } = useModels();
  const internal = models.find((model) => model.isInternal);
  const lockedLabel = agent ? (agent.isSensitive ? `${internal?.name ?? "مدل داخلی"} (الزامی)` : `${models.find((model) => model.id === agent.defaultModelId)?.name ?? "مدل پیش‌فرض"} (پیش‌فرض عامل)`) : undefined;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ModelPicker value={settings.model} onChange={(model) => updateSettings(conversationId, { model })} lockedLabel={lockedLabel} />
      <Badge variant="success" data-ai title="پیامی که داده‌ی حساس دارد یا فایل محرمانه‌ی سازمان را می‌خواند، فقط به مدل داخلی فرستاده می‌شود.">🔒 داده حساس ← فقط مدل داخلی</Badge>
    </div>
  );
}
