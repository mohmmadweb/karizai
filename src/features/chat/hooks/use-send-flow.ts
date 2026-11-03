"use client";

import { useState } from "react";
import type { Agent } from "@/features/agents/types";
import type { Connection } from "@/features/connections/types";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { resolveModel } from "@/features/model-catalog/lib/resolve-model";
import type { CatalogModel } from "@/features/model-catalog/types";
import { getKnowledgeDocument, getKnowledgeDocuments, isConfidentialDocument } from "@/features/knowledge/data/documents";
import { usePolicies } from "@/features/policies/components/policies-provider";
import { useDemoFlags } from "@/lib/demo-flags";
import { maskWithPolicy } from "@/lib/masking";
import { findCannedReply } from "../data/scripted-replies";
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
  /** Only an internal model may answer (internet cut, a field or file the admin marked, or the user's choice). */
  internalOnly: boolean;
};

type FlowInput = {
  settings: ConversationSettings;
  agent: Agent | null;
  connections: Connection[];
  onSend: (message: ReadyMessage) => void;
};

type Pending = { text: string; attachments: Attachment[]; preview: string; labels: string };

/**
 * Checks a message before it is sent: Agent state, forbidden text, confidential documents, masking by the
 * saved policies, and model fit. One masking mechanism (`maskWithPolicy`): an external model only ever gets
 * the masked text, and a message with hidden values first shows the user what the model will see.
 */
export function useSendFlow({ settings, agent, connections, onSend }: FlowInput) {
  const { allowedModels: models, routers } = useModels();
  const policies = usePolicies();
  const { offline } = useDemoFlags();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);

  function resolve(text: string, attachments: Attachment[], options: { forceInternal?: boolean; internalReason?: string }) {
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
      return null;
    }
    return { model, fixedFallback, note: result.status === "ok" ? result.note : undefined };
  }

  function proceed(text: string, attachments: Attachment[], options: { forceInternal?: boolean; internalReason?: string; confirmed?: boolean } = {}) {
    const resolved = resolve(text, attachments, options);
    if (!resolved) return;
    const { model, fixedFallback, note } = resolved;
    // Sensitive values never reach an external model: the saved policies decide what is hidden.
    const { masked, map, count } = model.isInternal ? { masked: text, map: [], count: 0 } : maskWithPolicy(text, policies.masking);
    if (count > 0 && !options.confirmed) {
      const labels = [...new Set(map.map((item) => item.token.replace(/^\[|-[۰-۹]+\]$/g, "").replace(/-/g, " ")))].map((label) => `«${label}»`).join("، ");
      setPending({ text, attachments, preview: masked, labels });
      return;
    }
    setNotice(null);
    // A message with only files still goes out; the model is asked to look at the files.
    const sentText = masked || "فایل‌های پیوست را بررسی کن و خلاصه‌ی آن‌ها را بنویس.";
    const keepInside = Boolean(offline || options.internalReason || options.forceInternal) && model.isInternal;
    onSend({ text, sentText, masks: map, modelName: fixedFallback ? "" : model.name, modelId: model.id, isReal: Boolean(model.isReal), routerReason: note, attachments, internalOnly: keepInside });
  }

  /** The first confidential document the message uses: an attached file, a source of the prepared answer, or a title written in the text. */
  function confidentialReason(text: string, attachments: Attachment[]): string | undefined {
    const confidentialDocs = getKnowledgeDocuments().filter((doc) => isConfidentialDocument(doc, policies));
    const file = attachments.find((item) => { const doc = item.docId ? getKnowledgeDocument(item.docId) : undefined; return doc ? isConfidentialDocument(doc, policies) : item.confidential; });
    if (file) return `فایل «${file.name}» محرمانه است؛`;
    const source = settings.knowledge ? findCannedReply({ agent, connections, knowledge: true, text, attachments })?.sources?.find((item) => confidentialDocs.some((doc) => item.title.includes(doc.title))) : undefined;
    if (source) return `منبع «${source.title}» محرمانه است؛`;
    const named = confidentialDocs.find((doc) => text.toLowerCase().includes(doc.title.toLowerCase()));
    return named ? `سند «${named.title}» محرمانه است؛` : undefined;
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
    // Confidential documents keep the request inside the organization: only an internal model answers.
    proceed(text, attachments, { internalReason: confidentialReason(text, attachments) });
  }

  const close = () => setPending(null);

  return {
    notice,
    dismissNotice: () => setNotice(null),
    attempt,
    sensitiveReason: pending ? `در پیام شما این موارد حساس دیده می‌شود: ${pending.labels}.` : null,
    maskedPreview: pending?.preview ?? null,
    maskAndSend: () => { if (pending) proceed(pending.text, pending.attachments, { confirmed: true }); close(); },
    sendInternal: () => { if (pending) proceed(pending.text, pending.attachments, { forceInternal: true }); close(); },
    cancelSensitive: close,
  };
}
