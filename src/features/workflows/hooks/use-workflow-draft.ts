"use client";

import { useState } from "react";
import { defaultChecks, getMlModel, sampleCode } from "../data/ml-models";
import type { NodeConfig, NodeKind, Trigger, Workflow, WorkflowEdge, WorkflowNode } from "../types";

/** What the «+» on a block adds: a kind of step, or an existing Agent, skill, or tool already filled in. */
export type NewBlock = { kind: NodeKind; label?: string; config?: NodeConfig };

export const nodeKindLabels: Record<NodeKind, string> = {
  agent: "Agent",
  skill: "اسکیل",
  tool: "ابزار",
  condition: "شرط",
  approval: "تأیید انسانی",
  orchestrator: "هماهنگ‌کننده‌ی چند Agent",
  code: "کد یا اسکریپت",
  "ml-model": "مدل ML",
  "prompt-optimizer": "بهینه‌ساز پرامپت",
  router: "مسیریاب هوشمند",
  supervisor: "ناظر",
  fork: "شاخه‌ی موازی",
  join: "پیوستن شاخه‌ها",
};

const defaultLabels: Record<NodeKind, string> = {
  agent: "گام Agent",
  skill: "گام اسکیل",
  tool: "گام ابزار",
  condition: "شرط تازه",
  approval: "تأیید شما",
  orchestrator: "هماهنگ‌کننده",
  code: "اسکریپت",
  "ml-model": "مدل ML",
  "prompt-optimizer": "✦ بهینه‌ساز پرامپت",
  router: "✦ مسیریاب هوشمند",
  supervisor: "✦ ناظر",
  fork: "شاخه‌ی موازی",
  join: "پیوستن شاخه‌ها",
};

/** Settings a new step of each kind starts with. */
function defaultConfig(kind: NodeKind, extra: NodeConfig | undefined): NodeConfig {
  const base: Partial<Record<NodeKind, NodeConfig>> = {
    orchestrator: { childAgentIds: [], maxSteps: 8 },
    code: { language: "python", code: sampleCode.python },
    router: { childAgentIds: [] },
    supervisor: { checks: defaultChecks },
    "prompt-optimizer": { instruction: "پرسش کاربر را روشن، کامل و با قالب خروجی جدول بازنویسی کن." },
  };
  return { ...base[kind], ...extra };
}

function labelOf(block: NewBlock): string {
  if (block.label) return block.label;
  if (block.kind === "ml-model") return `✦ ${getMlModel(block.config?.mlModelId)?.name ?? "مدل ML"}`;
  return defaultLabels[block.kind];
}

/** The workflow being edited: changes stay here until the user saves. */
export function useWorkflowDraft(saved: Workflow) {
  const [draft, setDraft] = useState<Workflow>(saved);
  const [savedCopy, setSavedCopy] = useState(JSON.stringify({ n: saved.name, d: saved.description, t: saved.triggers, no: saved.nodes, e: saved.edges }));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const snapshot = (w: Workflow) => JSON.stringify({ n: w.name, d: w.description, t: w.triggers, no: w.nodes, e: w.edges });
  const dirty = snapshot(draft) !== savedCopy;
  const patch = (change: Partial<Workflow>) => setDraft((current) => ({ ...current, ...change }));

  return {
    draft,
    dirty,
    selected: draft.nodes.find((node) => node.id === selectedId) ?? null,
    select: setSelectedId,
    markSaved: () => setSavedCopy(snapshot(draft)),
    rename: (name: string) => patch({ name }),
    setTriggers: (triggers: Trigger[]) => patch({ triggers }),
    /** The first block of an empty canvas. */
    addFirst: (block: NewBlock) =>
      setDraft((current) => {
        const node: WorkflowNode = {
          id: `n-${Date.now().toString(36)}-0`,
          kind: block.kind,
          label: labelOf(block),
          position: { x: 0, y: 0 },
          config: defaultConfig(block.kind, block.config),
        };
        setSelectedId(node.id);
        return { ...current, nodes: [node], edges: [] };
      }),
    /** Adds a block after another one and connects them. A condition's two paths are labelled «بله» then «خیر». */
    addAfter: (sourceId: string, block: NewBlock) =>
      setDraft((current) => {
        const source = current.nodes.find((node) => node.id === sourceId);
        if (!source) return current;
        const outgoing = current.edges.filter((edge) => edge.source === sourceId).length;
        const node: WorkflowNode = {
          id: `n-${Date.now().toString(36)}-${current.nodes.length}`,
          kind: block.kind,
          label: labelOf(block),
          position: { x: source.position.x + outgoing * 230, y: source.position.y + 130 },
          config: defaultConfig(block.kind, block.config),
        };
        const label = source.kind === "condition" ? (outgoing === 0 ? "بله" : "خیر") : source.kind === "fork" ? `شاخه ${(outgoing + 1).toLocaleString("fa-IR")}` : undefined;
        setSelectedId(node.id);
        return { ...current, nodes: [...current.nodes, node], edges: [...current.edges, { id: `e-${sourceId}-${node.id}`, source: sourceId, target: node.id, label }] };
      }),
    updateNode: (id: string, change: { label?: string; config?: Partial<NodeConfig> }) =>
      setDraft((current) => ({
        ...current,
        nodes: current.nodes.map((node) => (node.id === id ? { ...node, label: change.label ?? node.label, config: { ...node.config, ...change.config } } : node)),
      })),
    removeNode: (id: string) => {
      setDraft((current) => ({
        ...current,
        nodes: current.nodes.filter((node) => node.id !== id),
        edges: current.edges.filter((edge) => edge.source !== id && edge.target !== id),
      }));
      setSelectedId(null);
    },
    setGraph: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => setDraft((current) => ({ ...current, nodes, edges })),
    /** Points the «خطا» path of a step at another step, or removes it (null). */
    setErrorTarget: (sourceId: string, targetId: string | null) =>
      setDraft((current) => ({
        ...current,
        edges: [
          ...current.edges.filter((edge) => !(edge.source === sourceId && edge.label === "خطا")),
          ...(targetId ? [{ id: `e-err-${sourceId}-${targetId}`, source: sourceId, target: targetId, label: "خطا" }] : []),
        ],
      })),
  };
}

export type WorkflowDraft = ReturnType<typeof useWorkflowDraft>;
