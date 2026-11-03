"use client";

import { useState } from "react";
import type { Agent } from "@/features/agents/types";
import type { Connection } from "@/features/connections/types";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { resolveModel } from "@/features/model-catalog/lib/resolve-model";
import type { CatalogModel } from "@/features/model-catalog/types";
import { findCannedReply } from "../data/scripted-replies";
import { maskWithPolicy } from "@/lib/masking";
import { isConfidential } from "@/lib/policies";
import { getKnowledgeDocuments } from "@/features/knowledge/data/documents";
import { usePolicies } from "@/features/policies/components/policies-provider";
import { checkForbidden } from "../lib/sensitive-check";
import type { MaskEntry } from "./use-chat-engine";
import type { Attachment, ConversationSettings } from "../types";

export type Notice = {
  tone: "warning" | "destructive" | "info";
  title: string;
  text: string;
  suggestion?: CatalogModel;
  /** Models the user can pick instead, for example the internal ones. */
  suggestions?: CatalogModel[];
};

export type ReadyMessage = {
  text: string;
  sentText: string;
  masks: MaskEntry[];
  modelName: string;
  modelId: string;
  /** True when a registered provider's model really answers. */
  isReal: boolean;
  routerReason?: string;
  attachments: Attachment[];
};

type FlowInput = {
  settings: ConversationSettings;
  agent: Agent | null;
  connections: Connection[];
  onSend: (message: ReadyMessage) => void;
};

/** Checks a message before it is sent: Agent state, forbidden text, confidential documents, automatic masking, and model fit. */
export function useSendFlow({ settings, agent, connections, onSend }: FlowInput) {
  const { models, routers } = useModels();
  const [notice, setNotice] = useState<Notice | null>(null);
  const policies = usePolicies();

  function proceed(text: string, attachments: Attachment[], options: { forceInternal?: boolean } = {}) {
    const result = resolveModel({
      choice: settings.model,
      agent,
      attachments,
      usesTools: connections.length > 0,
      models,
      routers,
      prompt: text,
      forceInternal: options.forceInternal,
    });
    // A prepared answer does not depend on the model, so a model that cannot use tools must not stop it.
    const fixedFallback = result.status !== "ok" && findCannedReply({ agent, connections, knowledge: settings.knowledge, text }) ? (models.find((model) => model.isAvailable) ?? models[0]) : undefined;
    const model = result.status === "ok" ? result.model : fixedFallback;
    if (!model) {
      if (result.status === "blocked") setNotice({ tone: "destructive", title: "پیام ارسال نشد", text: result.reason });
      else if (result.status === "incompatible") setNotice({ tone: "warning", title: "مدل با پیام شما سازگار نیست", text: result.reason, suggestion: result.suggestion });
      return;
    }
    // A confidential document only goes to a model that runs inside the organization.
    const mentioned = getKnowledgeDocuments().find((item) => (policies.confidentialDocumentIds === null ? item.confidential : isConfidential(policies, item.id)) && text.toLowerCase().includes(item.title.toLowerCase()));
    if (mentioned && !model.isInternal) {
      const internal = models.filter((item) => item.isInternal && item.isAvailable);
      setNotice({
        tone: "destructive",
        title: "این سند فقط با مدل داخلی قابل استفاده است",
        text: `«${mentioned.title}» محرمانه است و به مدل بیرونی فرستاده نمی‌شود.${internal.length > 0 ? " یکی از مدل‌های داخلی را انتخاب کنید." : " هیچ مدل داخلی در دسترس نیست."}`,
        suggestions: internal,
      });
      return;
    }
    // Sensitive values never reach the model: the saved policies decide what is hidden.
    const { masked, map, count } = maskWithPolicy(text, policies.masking);
    setNotice(count > 0 ? { tone: "info", title: "مواردی برای مدل پنهان شد", text: "مقدار اصلی در پاسخ برای شما نمایش داده می‌شود." } : null);
    // A message with only files still goes out; the model is asked to look at the files.
    const sentText = masked || "فایل‌های پیوست را بررسی کن و خلاصه‌ی آن‌ها را بنویس.";
    onSend({ text, sentText, masks: map, modelName: fixedFallback ? "" : model.name, modelId: model.id, isReal: Boolean(model.isReal), routerReason: result.status === "ok" ? result.note : undefined, attachments });
  }

  function attempt(text: string, attachments: Attachment[]) {
    if (agent && !agent.isEnabled) {
      setNotice({ tone: "destructive", title: "این Agent اجرا نمی‌شود", text: agent.disabledReason ?? "این Agent در دسترس نیست." });
      return;
    }
    const forbidden = checkForbidden(text);
    if (forbidden) {
      setNotice({ tone: "destructive", title: "این پیام ارسال نمی‌شود", text: forbidden });
      return;
    }
    proceed(text, attachments);
  }

  return {
    notice,
    dismissNotice: () => setNotice(null),
    attempt,
  };
}
