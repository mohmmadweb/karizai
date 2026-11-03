"use client";

import { useState } from "react";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { validateAgent, type AgentErrors } from "../lib/agent-validation";
import type { Agent, AgentDraft } from "../types";

export const emptyDraft: AgentDraft = {
  name: "",
  purpose: "",
  instructions: "",
  defaultModelId: "",
  tools: [],
  skillIds: [],
  knowledgeIds: [],
  modelPolicy: "auto",
  runIn: ["assistant"],
};

function toDraft(agent: Agent | undefined): AgentDraft {
  if (!agent) return emptyDraft;
  const { name, purpose, instructions, defaultModelId, tools, skillIds, knowledgeIds = [], modelPolicy = "auto", runIn = ["assistant"], evalScore } = agent;
  return { name, purpose, instructions, defaultModelId, tools, skillIds, knowledgeIds, modelPolicy, runIn, evalScore };
}

/** Draft values, errors, and whether anything changed since the last save. */
export function useAgentForm(agent: Agent | undefined) {
  const { modelById } = useModels();
  const [saved, setSaved] = useState<AgentDraft>(toDraft(agent));
  const [draft, setDraft] = useState<AgentDraft>(saved);
  const [errors, setErrors] = useState<AgentErrors>({});

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  function setField<K extends keyof AgentDraft>(key: K, value: AgentDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key === "tools" ? "tools" : key]: undefined }));
  }

  function validate(): boolean {
    const found = validateAgent(draft, (agent?.isSensitive ?? false) || draft.modelPolicy === "internal-only", modelById);
    setErrors(found);
    return Object.keys(found).length === 0;
  }

  return { draft, errors, dirty, setField, validate, markSaved: () => setSaved(draft) };
}
