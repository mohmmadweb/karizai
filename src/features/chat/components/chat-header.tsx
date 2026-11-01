"use client";

import { useAgents } from "@/features/agents/components/agents-provider";
import { ModelPicker } from "@/features/model-catalog/components/model-picker";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { useChat } from "./chat-provider";

/** Model choice at the top of the conversation. */
export function ChatHeader({ conversationId }: { conversationId: string | null }) {
  const { state, updateSettings } = useChat();
  const { agents } = useAgents();
  const settings = state.conversations.find((item) => item.id === conversationId)?.settings ?? state.draft;
  const agent = agents.find((item) => item.id === settings.agentId);
  const { models } = useModels();
  const internal = models.find((model) => model.isInternal);
  const lockedLabel = agent ? (agent.isSensitive ? `${internal?.name ?? "مدل داخلی"} (الزامی)` : "مدل پیش‌فرض Agent") : undefined;

  return <ModelPicker value={settings.model} onChange={(model) => updateSettings(conversationId, { model })} lockedLabel={lockedLabel} />;
}
