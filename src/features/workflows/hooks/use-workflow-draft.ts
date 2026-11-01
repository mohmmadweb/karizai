"use client";

import { useState } from "react";
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
};

const defaultLabels: Record<NodeKind, string> = {
  agent: "گام Agent",
  skill: "گام اسکیل",
  tool: "گام ابزار",
  condition: "شرط تازه",
  approval: "تأیید شما",
  orchestrator: "هماهنگ‌کننده",
};

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
          label: block.label ?? defaultLabels[block.kind],
          position: { x: 0, y: 0 },
          config: { ...(block.kind === "orchestrator" ? { childAgentIds: [], maxSteps: 8 } : {}), ...block.config },
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
          label: block.label ?? defaultLabels[block.kind],
          position: { x: source.position.x + outgoing * 230, y: source.position.y + 130 },
          config: { ...(block.kind === "orchestrator" ? { childAgentIds: [], maxSteps: 8 } : {}), ...block.config },
        };
        const label = source.kind === "condition" ? (outgoing === 0 ? "بله" : "خیر") : undefined;
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
  };
}

export type WorkflowDraft = ReturnType<typeof useWorkflowDraft>;
