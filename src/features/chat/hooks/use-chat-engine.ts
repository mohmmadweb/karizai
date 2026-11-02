"use client";

import { useCallback, useEffect, useRef, type Dispatch } from "react";
import type { Agent } from "@/features/agents/types";
import { getConnectionById } from "@/features/connections/data/connections";
import type { Connection, ToolRun } from "@/features/connections/types";
import { getCapabilities } from "@/features/user-session/data/session";
import type { ChatAction, ChatState } from "../lib/chat-reducer";
import { buildReply, estimateUsage, resolveRole, type Reply, type Role } from "../lib/mock-reply";
import { planOrchestration, supervisorStep, type PlannedStep } from "../lib/orchestration";
import { useOrchestration } from "./use-orchestration";
import { restoreText } from "../lib/sensitive-check";
import { findCannedReply } from "../data/scripted-replies";
import type { Attachment, Message, ScriptedReply } from "../types";

export type MaskEntry = { token: string; value: string };

export type SendInput = {
  conversationId: string;
  /** What the user wrote. */
  text: string;
  /** What goes to the model: the same text with sensitive values replaced by tokens. */
  sentText: string;
  masks: MaskEntry[];
  attachments: Attachment[];
  modelName: string;
  modelId: string;
  isReal: boolean;
  routerReason?: string;
  agent: Agent | null;
  connections: Connection[];
  webSearch: boolean;
  /** Answers come from the organization's documents. */
  knowledge: boolean;
  /** The smart supervisor checks this answer. */
  supervisor: boolean;
};

type Context = Pick<SendInput, "sentText" | "masks" | "agent" | "connections" | "webSearch" | "modelId" | "modelName" | "isReal" | "supervisor"> & {
  role: Role;
  routerReason?: string;
  /** A prepared answer for the chosen Agent, connection or knowledge; it wins over any model. */
  canned?: ScriptedReply;
  /** The final text of a multi-agent answer, built from the steps. */
  finalReply?: Reply;
};

const workflowToolId = "tool-16";

let counter = 100;
export const nextId = (prefix: string) => `${prefix}-${++counter}`;

/** Simulated answer pipeline: tool approval, tool run, then word-by-word text. */
export function useChatEngine(
  stateRef: React.RefObject<ChatState>,
  dispatch: Dispatch<ChatAction>,
  lookups: {
    agentModelName: (agentId?: string) => string;
    supervisorModels: (options: { sensitive: boolean; answeringModel: string }) => { independent: string | null; stronger: string | null };
  },
) {
  const timers = useRef(new Map<string, ReturnType<typeof setInterval | typeof setTimeout>>());
  const contexts = useRef(new Map<string, Context>());
  const controllers = useRef(new Map<string, AbortController>());

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach((timer) => clearInterval(timer));
  }, []);

  const patch = useCallback(
    (id: string, messageId: string, change: Partial<Message>) =>
      dispatch({ type: "patch-message", id, messageId, patch: change }),
    [dispatch],
  );

  const orchestration = useOrchestration({ patch, ...lookups });

  const clear = (messageId: string) => {
    const timer = timers.current.get(messageId);
    if (timer) clearInterval(timer);
    timers.current.delete(messageId);
  };

  /** Streams the answer; sensitive tokens are replaced by the original values only for the user. */
  const stream = useCallback(
    (id: string, messageId: string, extra: Partial<Message> = {}) => {
      const ctx = contexts.current.get(messageId);
      if (!ctx) return;
      const reply = ctx.finalReply ?? buildReply(ctx.sentText, ctx.agent, ctx.role, ctx.webSearch);
      const full = restoreText(reply.text, ctx.masks);
      const words = full.split(" ");
      let shown = 0;
      clear(messageId);
      const timer = setInterval(() => {
        shown += 2;
        if (shown >= words.length) {
          clear(messageId);
          patch(id, messageId, {
            text: full, status: "done", sources: reply.sources, structured: reply.structured, files: reply.files,
            toolNames: [...(extra.toolNames ?? []), ...reply.toolNames], ...extra,
            maskedCount: ctx.masks.length || undefined, routerReason: ctx.routerReason,
          });
          dispatch({ type: "usage", amount: estimateUsage(ctx.sentText, full) });
          return;
        }
        patch(id, messageId, { text: words.slice(0, shown).join(" ") });
      }, 70);
      timers.current.set(messageId, timer);
    },
    [dispatch, patch],
  );

  const runTool = useCallback(
    (id: string, messageId: string, run: ToolRun) => {
      // Tools come from the connections of this answer (the admin's definitions), then from the sample list.
      const own = contexts.current.get(messageId)?.connections.find((item) => item.id === run.connectionId);
      const tool = (own ?? getConnectionById(run.connectionId))?.tools.find((item) => item.id === run.toolId);
      // Permissions are checked again right before every run.
      if (!tool || !tool.userCanUse) {
        const error = "دسترسی شما به این ابزار برداشته شده است. برای دریافت دوباره‌ی دسترسی با ادمین تماس بگیرید.";
        patch(id, messageId, { toolRun: { ...run, status: "failed", error }, text: "ابزار اجرا نشد، اما گفتگو ادامه دارد. می‌توانید پرسش دیگری بپرسید یا بدون این ابزار جلو بروید.", status: "done", notes: [error] });
        return;
      }
      patch(id, messageId, { toolRun: { ...run, status: "running" } });
      const timer = setTimeout(() => {
        // The n8n workflow is simulated here; no request leaves the browser.
        const input = run.inputs[0]?.value ?? "";
        if (run.toolId === workflowToolId && input.includes("تایم‌اوت")) {
          const error = "جریان کاری در زمان مشخص پاسخ نداد. چند لحظه بعد دوباره تلاش کنید.";
          patch(id, messageId, { toolRun: { ...run, status: "failed", error }, text: "ابزار جواب نداد، اما گفتگو ادامه دارد. می‌توانید دوباره تلاش کنید یا پرسش دیگری بپرسید.", status: "done", notes: [error] });
          return;
        }
        const result = run.toolId === workflowToolId ? `خروجی جریان کاری: «${input.slice(0, 60)}» در ۳ مرحله پردازش شد و وضعیت نهایی «موفق» است.` : "اطلاعات درخواست‌شده با موفقیت دریافت شد.";
        patch(id, messageId, { toolRun: { ...run, status: "succeeded", result } });
        stream(id, messageId, { toolNames: [run.toolName] });
      }, 1000);
      timers.current.set(messageId, timer);
    },
    [patch, stream],
  );

  /** A registered provider's model really answers through `/api/chat`; tools and assistants stay simulated. */
  const realStream = useCallback(
    async (id: string, messageId: string, ctx: Context) => {
      const controller = new AbortController();
      controllers.current.set(messageId, controller);
      const history = (stateRef.current.messages[id] ?? [])
        .filter((item) => item.id !== messageId && item.text.trim() && item.status !== "error")
        .map((item) => ({ role: item.role, content: item.role === "user" ? (item.sentText ?? item.text) : item.text }));
      if (!(history.at(-1)?.role === "user" && history.at(-1)?.content === ctx.sentText)) {
        history.push({ role: "user", content: ctx.sentText });
      }
      const messages = ctx.agent ? [{ role: "system", content: ctx.agent.instructions }, ...history] : history;
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId: ctx.modelId, messages }),
          signal: controller.signal,
        });
        if (!response.ok || !response.body) {
          const result = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(result?.error ?? "ارتباط با مدل برقرار نشد.");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let received = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          received += decoder.decode(value, { stream: true });
          patch(id, messageId, { text: restoreText(received, ctx.masks) });
        }
        if (!received.trim()) throw new Error("مدل پاسخی نفرستاد. دوباره تلاش کنید.");
        const full = restoreText(received, ctx.masks);
        patch(id, messageId, { text: full, status: "done", maskedCount: ctx.masks.length || undefined, routerReason: ctx.routerReason });
        dispatch({ type: "usage", amount: estimateUsage(ctx.sentText, full) });
      } catch (error) {
        if (controller.signal.aborted) return;
        const reason = error instanceof Error ? error.message : "ارتباط با مدل برقرار نشد.";
        patch(id, messageId, { status: "error", error: `${reason} چند لحظه بعد دوباره تلاش کنید؛ پیام‌های قبلی سالم هستند.` });
      } finally {
        controllers.current.delete(messageId);
      }
    },
    [dispatch, patch, stateRef],
  );

  const begin = useCallback(
    (id: string, messageId: string, ctx: Context) => {
      contexts.current.set(messageId, ctx);
      // A prepared answer wins over any model; the steps are only shown running, nothing is requested.
      if (ctx.canned) {
        const canned = ctx.canned;
        const steps: PlannedStep[] = canned.steps.map((step) => ({ ...step }));
        const plan = ctx.supervisor ? [...steps, supervisorStep] : steps;
        contexts.current.set(messageId, { ...ctx, finalReply: { text: canned.text, sources: canned.sources ?? [], structured: canned.structured, files: canned.files, toolNames: canned.steps.filter((step) => step.kind === "tool").map((step) => step.title) } });
        void orchestration.run({ id, messageId, plan, question: ctx.sentText, modelName: ctx.modelName, sensitive: Boolean(ctx.agent?.isSensitive) }).then((outcome) => {
          if (!outcome) return;
          const used = outcome.steps.filter((step) => step.kind === "supervisor").reduce((sum, step) => sum + (step.inputTokens ?? 0) + (step.outputTokens ?? 0), 0);
          if (used > 0) dispatch({ type: "usage", amount: used });
          stream(id, messageId);
        });
        return;
      }
      if (ctx.isReal) {
        void realStream(id, messageId, ctx);
        return;
      }
      if (ctx.sentText.includes("خطا")) {
        const timer = setTimeout(() => {
          patch(id, messageId, { status: "error", error: "ارتباط با مدل برقرار نشد. چند لحظه بعد دوباره تلاش کنید؛ پیام‌های قبلی سالم هستند." });
        }, 800);
        timers.current.set(messageId, timer);
        return;
      }
      const agentPlan = planOrchestration(ctx.sentText);
      // With the supervisor on, every answer gets a timeline that ends with its check.
      const plan = ctx.supervisor ? [...(agentPlan ?? []), supervisorStep] : agentPlan;
      if (plan) {
        if (agentPlan) ctx = { ...ctx, routerReason: "مسیریاب هوشمند پرسش را بین چند عامل تقسیم کرد." };
        contexts.current.set(messageId, ctx);
        void orchestration.run({ id, messageId, plan, question: ctx.sentText, modelName: ctx.modelName, sensitive: Boolean(ctx.agent?.isSensitive) }).then((outcome) => {
          if (!outcome) return;
          const used = outcome.steps.filter((step) => step.kind === "supervisor").reduce((sum, step) => sum + (step.inputTokens ?? 0) + (step.outputTokens ?? 0), 0);
          if (used > 0) dispatch({ type: "usage", amount: used });
          // A re-run with a stronger model changes the model shown under the answer.
          const rerun = outcome.supervision?.outcome === "rerun" ? outcome.supervision.model : undefined;
          patch(id, messageId, { ...(agentPlan ? { sources: outcome.sources, toolNames: outcome.toolNames } : {}), ...(rerun ? { modelName: rerun } : {}) });
          if (ctx.isReal || !agentPlan) {
            void (ctx.isReal ? realStream(id, messageId, ctx) : Promise.resolve(stream(id, messageId)));
          } else {
            contexts.current.set(messageId, { ...ctx, finalReply: { text: outcome.text, sources: outcome.sources, toolNames: outcome.toolNames } });
            stream(id, messageId);
          }
        });
        return;
      }
      const connection = ctx.role ? undefined : ctx.connections.filter((item) => item.status === "ready")[0];
      const tool = connection?.tools.find((item) => item.requiresApproval) ?? connection?.tools[0];
      if (!connection || !tool) {
        const wait = setTimeout(() => stream(id, messageId), 500);
        timers.current.set(messageId, wait);
        return;
      }
      const run: ToolRun = {
        id: nextId("run"), connectionId: connection.id, toolId: tool.id, toolName: tool.name,
        description: tool.description,
        // The workflow tool receives what the user wrote.
        inputs: tool.id === workflowToolId ? [{ label: "ورودی فلو", value: ctx.sentText.slice(0, 120) }] : tool.sampleInputs.map((input) => ({ ...input, value: input.value || ctx.sentText.slice(0, 120) })),
        status: tool.requiresApproval ? "awaiting-approval" : "running",
      };
      patch(id, messageId, { toolRun: run });
      if (!tool.requiresApproval) runTool(id, messageId, run);
    },
    [dispatch, orchestration, patch, realStream, runTool, stream],
  );

  const send = useCallback(
    (input: SendInput) => {
      const now = new Date().toISOString();
      const assistantId = nextId("msg");
      const canned = findCannedReply({ agent: input.agent, connections: input.connections, knowledge: input.knowledge, text: input.sentText });
      const { role, auto } = input.isReal || canned ? { role: null, auto: false } : resolveRole(input.sentText, input.agent, getCapabilities());
      // The Agent's own model may be missing from the registered models; then a plain name is shown.
      const agentModel = (agentId: string) => { const name = lookups.agentModelName(agentId); return name === "خودکار" ? "Claude Sonnet" : name; };
      // A prepared answer shows the Agent's own model; a fixed one (no model answers) shows none.
      const modelName = !canned ? input.modelName : canned.fixed ? "" : input.agent ? agentModel(input.agent.id) : input.isReal || !input.modelName ? "Claude Sonnet" : input.modelName;
      const notes = (input.agent?.tools ?? [])
        .map((ref) => getConnectionById(ref.connectionId)?.tools.find((tool) => tool.id === ref.toolId))
        .filter((tool) => tool && !tool.userCanUse)
        .map((tool) => `ابزار «${tool?.name}» اجرا نشد، چون شما خودتان به آن دسترسی ندارید.`);
      const routerReason = canned ? undefined : auto && role
        ? `مسیریاب هوشمند ${role === "bi" ? "دستیار هوش تجاری" : "دستیار سند"} را برای این پرسش انتخاب کرد.`
        : input.routerReason;
      dispatch({
        type: "append",
        id: input.conversationId,
        messages: [
          { id: nextId("msg"), role: "user", text: input.text, sentText: input.sentText, createdAt: now, status: "done", sources: [], attachments: input.attachments },
          { id: assistantId, role: "assistant", text: "", createdAt: now, status: "streaming", modelName, agentName: input.agent?.name, sources: [], attachments: [], notes },
        ],
      });
      begin(input.conversationId, assistantId, { ...input, modelName, isReal: canned ? false : input.isReal, role, routerReason, canned });
    },
    [begin, dispatch, lookups],
  );

  const stop = useCallback(
    (id: string, messageId: string) => {
      clear(messageId);
      controllers.current.get(messageId)?.abort();
      orchestration.stop(messageId);
      const timeline = stateRef.current.messages[id]?.find((item) => item.id === messageId)?.timeline;
      patch(id, messageId, {
        status: "stopped",
        timeline: timeline?.map((step) => (step.status === "done" || step.status === "failed" ? step : { ...step, status: "failed" as const, error: step.status === "pending" ? "انجام نشد." : "متوقف شد." })),
      });
    },
    [orchestration, patch, stateRef],
  );

  const findRun = (id: string, messageId: string) =>
    stateRef.current.messages[id]?.find((item) => item.id === messageId)?.toolRun;

  const approveTool = useCallback(
    (id: string, messageId: string) => {
      const run = findRun(id, messageId);
      if (run) runTool(id, messageId, run);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runTool],
  );

  const rejectTool = useCallback(
    (id: string, messageId: string) => {
      const run = findRun(id, messageId);
      if (!run) return;
      patch(id, messageId, {
        toolRun: { ...run, status: "rejected" },
        text: "ابزار اجرا نشد، چون تأیید نکردید. هر وقت خواستید می‌توانید دوباره درخواست بدهید.",
        status: "done",
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [patch],
  );

  const retry = useCallback(
    (id: string, messageId: string) => {
      const ctx = contexts.current.get(messageId);
      if (!ctx) return;
      patch(id, messageId, { status: "streaming", error: undefined, text: "", toolRun: undefined, timeline: undefined });
      begin(id, messageId, { ...ctx, sentText: ctx.isReal ? ctx.sentText : ctx.sentText.replace("خطا", "") });
    },
    [begin, patch],
  );

  return { send, stop, approveTool, rejectTool, retry, decideStep: orchestration.decide };
}
