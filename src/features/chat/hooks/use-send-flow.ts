"use client";

import { useState } from "react";
import type { Agent } from "@/features/agents/types";
import type { Connection } from "@/features/connections/types";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { resolveModel } from "@/features/model-catalog/lib/resolve-model";
import type { CatalogModel } from "@/features/model-catalog/types";
import { getKnowledgeDocument, getKnowledgeDocuments, isConfidentialDocument } from "@/features/knowledge/data/documents";
import { useDemoFlags } from "@/lib/demo-flags";
import { usePolicies } from "@/lib/policy-store";
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
  /** Only an internal model may answer (internet cut, a field or file the admin marked, or the user's choice). */
  internalOnly: boolean;
};

type FlowInput = {
  settings: ConversationSettings;
  agent: Agent | null;
  connections: Connection[];
  onSend: (message: ReadyMessage) => void;
};

type Pending = { text: string; attachments: Attachment[]; reason: string; matches: SensitiveMatch[]; preview: string };

/** Checks a message before it is sent: Agent state, forbidden and sensitive text, masking, and model fit. */
export function useSendFlow({ settings, agent, connections, onSend }: FlowInput) {
  const { allowedModels: models, routers } = useModels();
  const { maskFields, confidentialDocIds } = usePolicies();
  const { offline } = useDemoFlags();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);

  function proceed(text: string, attachments: Attachment[], options: { matches?: SensitiveMatch[]; forceInternal?: boolean; internalReason?: string } = {}) {
    const result = resolveModel({
      choice: settings.model,
      agent,
      attachments,
      usesTools: connections.length > 0,
      models,
      routers,
      prompt: text,
      forceInternal: options.forceInternal,
      offline,
      internalReason: options.internalReason,
    });
    // A prepared answer does not depend on the model, so a model that cannot use tools must not stop it.
    const fixedFallback = result.status !== "ok" && findCannedReply({ agent, connections, knowledge: settings.knowledge, text, attachments }) ? (models.find((model) => model.isAvailable) ?? models[0]) : undefined;
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
    const keepInside = Boolean(offline || options.internalReason || options.forceInternal) && model.isInternal;
    onSend({ text, sentText, masks: map, modelName: fixedFallback ? "" : model.name, modelId: model.id, isReal: Boolean(model.isReal), routerReason: result.status === "ok" ? result.note : undefined, attachments, internalOnly: keepInside });
  }

  function attempt(text: string, attachments: Attachment[]) {
    if (agent && !agent.isEnabled) {
      setNotice({ tone: "destructive", title: "این Agent اجرا نمی‌شود", text: agent.disabledReason ?? "این Agent در دسترس نیست." });
      return;
    }
    const check = checkSensitive(text, maskFields);
    if (check.kind === "forbidden") {
      setNotice({ tone: "destructive", title: "این پیام ارسال نمی‌شود", text: check.reason });
      return;
    }
    // Files and sources the admin marked confidential keep the request inside the organization.
    const confidentialTitles = getKnowledgeDocuments().filter((doc) => isConfidentialDocument(doc, confidentialDocIds)).map((doc) => doc.title);
    const file = attachments.find((item) => { const doc = item.docId ? getKnowledgeDocument(item.docId) : undefined; return doc ? isConfidentialDocument(doc, confidentialDocIds) : item.confidential; });
    const source = settings.knowledge ? findCannedReply({ agent, connections, knowledge: true, text, attachments })?.sources?.find((item) => confidentialTitles.some((title) => item.title.includes(title))) : undefined;
    const confidential = file ? `فایل «${file.name}» محرمانه است؛` : source ? `منبع «${source.title}» محرمانه است؛` : undefined;
    if (check.kind === "internal-only" || confidential) {
      proceed(text, attachments, { internalReason: [check.kind === "internal-only" ? check.reason : "", confidential ?? ""].filter(Boolean).join(" ") });
      return;
    }
    if (check.kind === "warning") {
      setPending({ text, attachments, reason: check.reason, matches: check.matches, preview: check.preview });
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
    maskedPreview: pending?.preview ?? null,
    maskAndSend: () => { if (pending) proceed(pending.text, pending.attachments, { matches: pending.matches }); close(); },
    sendInternal: () => { if (pending) proceed(pending.text, pending.attachments, { forceInternal: true }); close(); },
    cancelSensitive: close,
  };
}
