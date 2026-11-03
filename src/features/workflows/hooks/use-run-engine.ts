"use client";

import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { runOrder } from "../lib/graph";
import { taskFromStep } from "../lib/task-step";
import type { Run, RunStep, Workflow, WorkflowNode } from "../types";

const outputs: Record<WorkflowNode["kind"], string> = {
  agent: "Agent کار را انجام داد و نتیجه را برگرداند.",
  skill: "اسکیل اجرا شد و نتیجه را برگرداند.",
  tool: "ابزار با موفقیت اجرا شد.",
  condition: "شرط بررسی شد.",
  approval: "تأیید شد.",
  orchestrator: "هماهنگ‌کننده کار را بین Agentها تقسیم کرد و نتیجه‌ها را جمع کرد.",
};

/** Typical token use per kind of step; tools, conditions without a model, and approvals spend none. */
const baseTokens: Record<WorkflowNode["kind"], [number, number]> = {
  agent: [620, 380],
  skill: [420, 260],
  condition: [90, 12],
  approval: [0, 0],
  tool: [0, 0],
  orchestrator: [2400, 1500],
};

function tokensOf(node: WorkflowNode): Pick<RunStep, "inputTokens" | "outputTokens"> {
  const [input, output] = baseTokens[node.kind];
  if (input === 0) return {};
  const spread = (node.label.length * 17) % 140;
  return { inputTokens: input + spread, outputTokens: output + Math.round(spread / 2) };
}

let counter = 0;

/**
 * Simulated run: steps run one after another with a short wait. An approval
 * step pauses the run until the user decides. Nothing runs on a server.
 */
export function useRunEngine(setRuns: Dispatch<SetStateAction<Run[]>>, modelNameOf: (node: WorkflowNode) => string | undefined) {
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const nameRef = useRef(modelNameOf);
  useEffect(() => {
    nameRef.current = modelNameOf;
  });
  const waiting = useRef(new Map<string, (approved: boolean) => void>());

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach(clearTimeout);
  }, []);

  const update = useCallback(
    (runId: string, change: (run: Run) => Run) => setRuns((list) => list.map((run) => (run.id === runId ? change(run) : run))),
    [setRuns],
  );
  const patchStep = useCallback(
    (runId: string, nodeId: string, patch: Partial<RunStep>) =>
      update(runId, (run) => ({ ...run, steps: run.steps.map((step) => (step.nodeId === nodeId ? { ...step, ...patch } : step)) })),
    [update],
  );
  const wait = (ms: number) => new Promise<void>((resolve) => timers.current.add(setTimeout(resolve, ms)));

  const start = useCallback(
    (workflow: Workflow, startedBy: string): string => {
      const { order, skipped } = runOrder(workflow.nodes, workflow.edges);
      const runId = `run-new-${++counter}`;
      const steps: RunStep[] = [
        ...order.map((node) => ({ nodeId: node.id, label: node.label, status: "pending" as const })),
        ...skipped.map((node) => ({ nodeId: node.id, label: node.label, status: "skipped" as const })),
      ];
      setRuns((list) => [{ id: runId, workflowId: workflow.id, startedAt: new Date().toISOString(), status: "running", startedBy, steps }, ...list]);

      void (async () => {
        const began = Date.now();
        for (const node of order) {
          patchStep(runId, node.id, { status: "running" });
          const stepStart = Date.now();
          if (node.kind === "approval") {
            update(runId, (run) => ({ ...run, status: "waiting-approval" }));
            patchStep(runId, node.id, { status: "waiting-approval" });
            const approved = await new Promise<boolean>((resolve) => waiting.current.set(runId, resolve));
            update(runId, (run) => ({ ...run, status: "running" }));
            if (!approved) {
              patchStep(runId, node.id, { status: "failed", error: "تأیید داده نشد و کار متوقف شد.", durationMs: Date.now() - stepStart });
              update(runId, (run) => ({ ...run, status: "failed", endedAt: new Date().toISOString() }));
              toast.error(`کار «${workflow.name}» متوقف شد.`, { description: "تأیید داده نشد." });
              return;
            }
          } else {
            await wait(900 + (node.label.length % 5) * 150);
          }
          if (node.config.instruction?.includes("خطا")) {
            patchStep(runId, node.id, { status: "failed", error: "این گام با خطا روبه‌رو شد. تنظیم آن را بررسی کنید.", durationMs: Date.now() - stepStart });
            update(runId, (run) => ({ ...run, status: "failed", endedAt: new Date().toISOString() }));
            toast.error(`کار «${workflow.name}» ناموفق بود.`, { description: `گام «${node.label}» خطا داد.` });
            return;
          }
          patchStep(runId, node.id, { status: "succeeded", output: taskFromStep(node) ? `وظیفه‌ی «${taskFromStep(node)?.title}» در وظایف من ثبت شد.` : outputs[node.kind], durationMs: Date.now() - stepStart, modelName: nameRef.current(node), ...tokensOf(node) });
        }
        update(runId, (run) => ({ ...run, status: "succeeded", endedAt: new Date().toISOString() }));
        toast.success(`کار «${workflow.name}» تمام شد.`, { description: `${Math.max(1, Math.round((Date.now() - began) / 1000)).toLocaleString("fa-IR")} ثانیه طول کشید.` });
      })();
      return runId;
    },
    [patchStep, setRuns, update],
  );

  const decide = useCallback((runId: string, approved: boolean) => {
    waiting.current.get(runId)?.(approved);
    waiting.current.delete(runId);
  }, []);

  return { start, decide };
}
