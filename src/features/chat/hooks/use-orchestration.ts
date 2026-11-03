"use client";

import { useCallback, useEffect, useRef } from "react";
import { getCapabilities } from "@/features/user-session/data/session";
import type { PlannedStep } from "../lib/orchestration";
import type { Message, TimelineStep } from "../types";
import { runTimeline, type TimelineOutcome } from "./run-timeline";

type Options = {
  patch: (id: string, messageId: string, change: Partial<Message>) => void;
  /** Name of the model an Agent uses by default. */
  agentModelName: (agentId?: string) => string;
  /** Model the supervisor uses; `null` when none is allowed. */
  supervisorModels: (options: { sensitive: boolean; answeringModel: string }) => { independent: string | null; stronger: string | null };
};

type RunInput = { id: string; messageId: string; plan: PlannedStep[]; question: string; modelName: string; sensitive: boolean; /** Finished steps shown before the plan, for example the prompt optimizer. */ prefix?: TimelineStep[] };

/** Runs the multi-agent timeline of one answer. Stopping aborts the waits and the approval question. */
export function useOrchestration({ patch, agentModelName, supervisorModels }: Options) {
  const controllers = useRef(new Map<string, AbortController>());
  const approvals = useRef(new Map<string, (approved: boolean) => void>());
  const names = useRef(agentModelName);
  const supervisorRef = useRef(supervisorModels);
  useEffect(() => {
    names.current = agentModelName;
    supervisorRef.current = supervisorModels;
  });
  useEffect(() => {
    const active = controllers.current;
    return () => active.forEach((controller) => controller.abort());
  }, []);

  /** Resolves with the outcome, or `null` when the user stopped it. */
  const run = useCallback(
    async ({ id, messageId, plan, question, modelName, sensitive, prefix = [] }: RunInput): Promise<TimelineOutcome | null> => {
      const controller = new AbortController();
      controllers.current.set(messageId, controller);
      const { signal } = controller;
      const wait = (ms: number) =>
        new Promise<void>((resolve, reject) => {
          if (signal.aborted) return reject(new Error("stopped"));
          const timer = setTimeout(resolve, ms);
          signal.addEventListener("abort", () => { clearTimeout(timer); reject(new Error("stopped")); }, { once: true });
        });
      try {
        const outcome = await runTimeline({
          plan,
          capabilities: getCapabilities(),
          question,
          thinkingModel: modelName,
          agentModelName: (agentId) => names.current(agentId),
          update: (steps: TimelineStep[]) => patch(id, messageId, { timeline: [...prefix, ...steps] }),
          wait,
          supervisor: (() => { const picked = supervisorRef.current({ sensitive, answeringModel: modelName }); return { sensitive, independentModel: picked.independent, strongerModel: picked.stronger }; })(),
          askApproval: () =>
            new Promise<boolean>((resolve, reject) => {
              approvals.current.set(messageId, resolve);
              signal.addEventListener("abort", () => reject(new Error("stopped")), { once: true });
            }),
        });
        // A short pause before the final answer starts, so the steps can be read.
        await wait(1500);
        return outcome;
      } catch {
        return null;
      } finally {
        controllers.current.delete(messageId);
        approvals.current.delete(messageId);
      }
    },
    [patch],
  );

  const stop = useCallback((messageId: string) => controllers.current.get(messageId)?.abort(), []);
  const decide = useCallback((messageId: string, approved: boolean) => {
    approvals.current.get(messageId)?.(approved);
    approvals.current.delete(messageId);
  }, []);

  return { run, stop, decide };
}
