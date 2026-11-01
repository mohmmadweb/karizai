"use client";

import { useState } from "react";
import type { Agent } from "@/features/agents/types";
import type { Connection } from "@/features/connections/types";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { resolveModel } from "@/features/model-catalog/lib/resolve-model";
import type { CatalogModel } from "@/features/model-catalog/types";
import { findCannedReply } from "../data/scripted-replies";
import { checkSensitive, maskText, type SensitiveMatch } from "../lib/sensitive-check";
import type { MaskEntry } from "./use-chat-engine";
import type { Attachment, ConversationSettings } from "../types";

export type Notice = {
  tone: "warning" | "destructive";
  title: string;
  text: string;
  suggestion?: CatalogModel;
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

type Pending = { text: string; attachments: Attachment[]; reason: string; matches: SensitiveMatch[] };

/** Checks a message before it is sent: Agent state, forbidden and sensitive text, masking, and model fit. */
export function useSendFlow({ settings, agent, connections, onSend }: FlowInput) {
  const { models, routers } = useModels();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);

  function proceed(text: string, attachments: Attachment[], options: { matches?: SensitiveMatch[]; forceInternal?: boolean } = {}) {
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
    setNotice(null);
    const { masked, map } = options.matches?.length ? maskText(text, options.matches) : { masked: text, map: [] };
    // A message with only files still goes out; the model is asked to look at the files.
    const sentText = masked || "فایل‌های پیوست را بررسی کن و خلاصه‌ی آن‌ها را بنویس.";
    onSend({ text, sentText, masks: map, modelName: fixedFallback ? "" : model.name, modelId: model.id, isReal: Boolean(model.isReal), routerReason: result.status === "ok" ? result.note : undefined, attachments });
  }

  function attempt(text: string, attachments: Attachment[]) {
    if (agent && !agent.isEnabled) {
      setNotice({ tone: "destructive", title: "این Agent اجرا نمی‌شود", text: agent.disabledReason ?? "این Agent در دسترس نیست." });
      return;
    }
    const check = checkSensitive(text);
    if (check.kind === "forbidden") {
      setNotice({ tone: "destructive", title: "این پیام ارسال نمی‌شود", text: check.reason });
      return;
    }
    if (check.kind === "warning") {
      setPending({ text, attachments, reason: check.reason, matches: check.matches });
      return;
    }
    proceed(text, attachments);
  }

  const close = () => setPending(null);

  return {
    notice,
    dismissNotice: () => setNotice(null),
    attempt,
    sensitiveReason: pending?.reason ?? null,
    maskAndSend: () => { if (pending) proceed(pending.text, pending.attachments, { matches: pending.matches }); close(); },
    sendInternal: () => { if (pending) proceed(pending.text, pending.attachments, { forceInternal: true }); close(); },
    cancelSensitive: close,
  };
}
