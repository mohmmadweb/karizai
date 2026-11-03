"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useAgents } from "@/features/agents/components/agents-provider";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { useRunEngine } from "../hooks/use-run-engine";
import { needsApproval } from "../lib/describe-trigger";
import type { Run, Workflow, WorkflowNode, WorkflowStatus, WorkflowTemplate } from "../types";

type WorkflowsContextValue = {
  workflows: Workflow[];
  runs: Run[];
  /** Creates a draft from a template or a generated draft and returns its id. */
  create: (template: Pick<WorkflowTemplate, "name" | "description" | "triggers" | "nodes" | "edges">) => string;
  save: (workflow: Workflow) => void;
  /** Activating a workflow with a schedule or event trigger waits for the admin. */
  activate: (id: string) => WorkflowStatus;
  setPaused: (id: string, paused: boolean) => void;
  remove: (id: string) => void;
  run: (id: string, startedBy: string) => string | null;
  decide: (runId: string, approved: boolean) => void;
  /** Runs a finished run again from one step (the step and everything after it). */
  rerunFrom: (runId: string, nodeId: string) => void;
  /** Admin approval queue: a workflow waiting for the admin becomes active, or goes back to draft. */
  decideActivation: (id: string, approved: boolean) => void;
};

const WorkflowsContext = createContext<WorkflowsContextValue | null>(null);

export function WorkflowsProvider({
  initialWorkflows,
  initialRuns,
  children,
}: {
  initialWorkflows: Workflow[];
  initialRuns: Run[];
  children: ReactNode;
}) {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [runs, setRuns] = useState(initialRuns);
  const counter = useRef(0);
  const { agents } = useAgents();
  const { modelById } = useModels();
  // Steps made by an Agent show the Agent's default model; router, optimizer and supervisor run on the internal model.
  const modelNameOf = (node: WorkflowNode) =>
    node.kind === "router" || node.kind === "prompt-optimizer" || node.kind === "supervisor"
      ? (modelById("model-8")?.name ?? "Qwen")
      : modelById(agents.find((item) => item.id === (node.config.agentId ?? node.config.childAgentIds?.[0]))?.defaultModelId ?? "")?.name;
  const agentNameOf = (id: string) => agents.find((item) => item.id === id)?.name;
  const engine = useRunEngine(setRuns, modelNameOf, agentNameOf);

  const value = useMemo<WorkflowsContextValue>(() => {
    const patch = (id: string, change: Partial<Workflow>) =>
      setWorkflows((list) => list.map((item) => (item.id === id ? { ...item, ...change, updatedAt: new Date().toISOString() } : item)));
    return {
      workflows,
      runs,
      create: (template) => {
        const id = `wf-new-${++counter.current}`;
        // The id comes last in the spread order so a template's own id never replaces it.
        const { name, description, triggers, nodes, edges } = template;
        const draft: Workflow = { id, name, description, triggers, nodes, edges, status: "draft", updatedAt: new Date().toISOString() };
        setWorkflows((list) => [draft, ...list]);
        return id;
      },
      save: (workflow) => patch(workflow.id, workflow),
      activate: (id) => {
        const target = workflows.find((item) => item.id === id);
        const status: WorkflowStatus = target && needsApproval(target.triggers) ? "pending-approval" : "active";
        patch(id, { status });
        return status;
      },
      setPaused: (id, paused) => patch(id, { status: paused ? "paused" : "active" }),
      remove: (id) => setWorkflows((list) => list.filter((item) => item.id !== id)),
      run: (id, startedBy) => {
        const target = workflows.find((item) => item.id === id);
        if (!target) return null;
        const runId = engine.start(target, startedBy);
        patch(id, { lastRunAt: new Date().toISOString() });
        return runId;
      },
      decide: engine.decide,
      rerunFrom: (runId, nodeId) => {
        const target = runs.find((item) => item.id === runId);
        const workflow = workflows.find((item) => item.id === target?.workflowId);
        if (target && workflow) engine.rerunFrom(target, workflow, nodeId);
      },
      decideActivation: (id, approved) => patch(id, { status: approved ? "active" : "draft" }),
    };
  }, [workflows, runs, engine]);

  return <WorkflowsContext.Provider value={value}>{children}</WorkflowsContext.Provider>;
}

export function useWorkflows(): WorkflowsContextValue {
  const value = useContext(WorkflowsContext);
  if (!value) throw new Error("useWorkflows must be used inside WorkflowsProvider");
  return value;
}
