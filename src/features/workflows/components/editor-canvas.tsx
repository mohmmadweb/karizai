"use client";

import "@xyflow/react/dist/style.css";
import { useMemo, useState } from "react";
import { applyEdgeChanges, applyNodeChanges, Background, Controls, ReactFlow, type Edge, type EdgeChange, type NodeChange, type OnConnect } from "@xyflow/react";
import { useTheme } from "@/lib/use-theme";
import type { WorkflowDraft } from "../hooks/use-workflow-draft";
import type { Run, WorkflowEdge, WorkflowNode } from "../types";
import { PlusIcon } from "lucide-react";
import { BlockMenu } from "./block-picker";
import { FlowStepNode, type FlowNode } from "./flow-node";

const nodeTypes = { step: FlowStepNode };

type Size = { width: number; height: number };

const toFlowNodes = (nodes: WorkflowNode[], edges: WorkflowEdge[], run: Run | undefined, subtitle: (node: WorkflowNode) => string | undefined, sizes: Record<string, Size>, addAfter: WorkflowDraft["addAfter"], stepEffects: Record<string, string>): FlowNode[] =>
  nodes.map((node) => ({
    id: node.id,
    type: "step",
    position: node.position,
    measured: sizes[node.id],
    data: { label: node.label, kind: node.kind, subtitle: subtitle(node), hasOutput: edges.some((edge) => edge.source === node.id), onAdd: (block) => addAfter(node.id, block), status: run?.steps.find((step) => step.nodeId === node.id)?.status, effect: stepEffects[node.id] },
  }));

// The «خطا» path is a dashed red line; it is only taken when its step fails.
const toFlowEdges = (edges: WorkflowEdge[], run: Run | undefined): Edge[] =>
  edges.map((edge) => ({ id: edge.id, source: edge.source, target: edge.target, label: edge.label, animated: run?.steps.find((step) => step.nodeId === edge.target)?.status === "running", ...(edge.label === "خطا" ? { style: { stroke: "var(--destructive)", strokeDasharray: "6 4" } } : {}) }));

type EditorCanvasProps = {
  draft: WorkflowDraft;
  /** The latest run, so steps light up while it goes. */
  run?: Run;
  subtitle: (node: WorkflowNode) => string | undefined;
  /** What each finished step did in the system, shown on its block. */
  stepEffects?: Record<string, string>;
};

const noEffects: Record<string, string> = {};

export function EditorCanvas({ draft, run, subtitle, stepEffects = noEffects }: EditorCanvasProps) {
  const { theme } = useTheme();
  const { nodes, edges } = draft.draft;
  // React Flow reports the size of each step; it must be handed back or the steps stay hidden.
  const [sizes, setSizes] = useState<Record<string, Size>>({});
  const flowNodes = useMemo(() => toFlowNodes(nodes, edges, run, subtitle, sizes, draft.addAfter, stepEffects), [nodes, edges, run, subtitle, sizes, draft.addAfter, stepEffects]);
  const flowEdges = useMemo(() => toFlowEdges(edges, run), [edges, run]);

  function onNodesChange(changes: NodeChange<FlowNode>[]) {
    const measuredNow: Record<string, Size> = {};
    changes.forEach((change) => {
      if (change.type === "dimensions" && change.dimensions) measuredNow[change.id] = change.dimensions;
    });
    if (Object.keys(measuredNow).length > 0) setSizes((current) => ({ ...current, ...measuredNow }));
    if (changes.every((change) => change.type === "dimensions" || change.type === "select")) return;
    const next = applyNodeChanges(changes, flowNodes);
    draft.setGraph(
      nodes.filter((node) => next.some((item) => item.id === node.id)).map((node) => ({ ...node, position: next.find((item) => item.id === node.id)!.position })),
      edges.filter((edge) => next.some((n) => n.id === edge.source) && next.some((n) => n.id === edge.target)),
    );
  }

  function onEdgesChange(changes: EdgeChange[]) {
    const next = applyEdgeChanges(changes, flowEdges);
    draft.setGraph(nodes, edges.filter((edge) => next.some((item) => item.id === edge.id)));
  }

  const onConnect: OnConnect = ({ source, target }) => {
    if (!source || !target || source === target || edges.some((e) => e.source === source && e.target === target)) return;
    const from = nodes.find((node) => node.id === source);
    const outgoing = edges.filter((edge) => edge.source === source).length;
    const label = from?.kind === "condition" ? (outgoing === 0 ? "بله" : "خیر") : from?.kind === "fork" ? `شاخه ${(outgoing + 1).toLocaleString("fa-IR")}` : undefined;
    draft.setGraph(nodes, [...edges, { id: `e-${source}-${target}`, source, target, label }]);
  };

  return (
    <div className="relative h-[28rem] overflow-hidden rounded-xl border bg-muted/30 lg:h-[34rem]" dir="ltr" aria-label="بوم طراحی کار">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        colorMode={theme}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => draft.select(node.id)}
        onPaneClick={() => draft.select(null)}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center" dir="rtl">
          <BlockMenu
            heading="گام اول"
            onPick={draft.addFirst}
            trigger={
              <button type="button" className="flex flex-col items-center gap-3 rounded-2xl text-muted-foreground outline-none transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50">
                <span className="flex size-24 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/60 bg-card/60">
                  <PlusIcon className="size-8" aria-hidden />
                </span>
                <span className="text-label">افزودن گام اول…</span>
              </button>
            }
          />
        </div>
      ) : null}
    </div>
  );
}
