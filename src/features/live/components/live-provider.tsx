"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAgents } from "@/features/agents/components/agents-provider";
import { useChat } from "@/features/chat/components/chat-provider";
import { useConnections } from "@/features/connections/components/connections-provider";
import { useKnowledgeFiles } from "@/features/knowledge/components/knowledge-files-provider";
import { getColleagueById } from "@/features/messenger/data/colleagues";
import { getGroupById } from "@/features/messenger/data/groups";
import { useMessenger } from "@/features/messenger/components/messenger-provider";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { useCalendar } from "@/features/social/components/calendar-provider";
import { getCurrentUser } from "@/features/user-session/data/session";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import type { Run, RunStep, Workflow, WorkflowNode } from "@/features/workflows/types";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { currentUserId } from "@/features/workspace/lib/people";
import { addDays } from "@/features/workspace/lib/today";
import { useDemoFlags } from "@/lib/demo-flags";
import { formatNumber } from "@/lib/format";
import { tomanPer1kTokens } from "@/lib/pricing";
import { auditIdentity, cueFor, effectsFor } from "../data/stories";
import { effectMeta, fileExtensions } from "../lib/effect-meta";
import type { EffectSpec, LiveAuditEntry, LiveEffect, LiveNotification, NotificationIcon, RunSummary } from "../types";
import { LiveDock } from "./live-dock";

type LiveContextValue = {
  effects: LiveEffect[];
  notifications: LiveNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  audit: LiveAuditEntry[];
  /** Runs started in this visit, newest first. */
  visitRuns: Run[];
  summaryOf: (run: Run) => RunSummary;
};

const LiveContext = createContext<LiveContextValue | null>(null);

/** Seconds between two starts of the demo clock, and until the first one. */
const clockMs = 50_000;
const firstTickMs = 6_000;
/** Effects of one step land one after another, so the feed reads like things happening. */
const staggerMs = 500;
const finishDelayMs = 1_800;
const replyMs = 4_000;

const seedNotifications: LiveNotification[] = [
  { id: "ntf-seed-1", icon: "channel", title: "بچ B-1405-2217 در آزمون رنگ مردود شد", description: "ΔE ۲٫۹، حد ۱٫۵ · کانال هشدارهای تولید", href: "/messenger/channels?id=ch-alerts", at: "2026-11-02T05:15:00.000Z", read: false },
  { id: "ntf-seed-2", icon: "alert", title: "دمای ناحیه‌ی ۴ اکسترودر خط ۲ از حد گذشت", description: "۲۴۸ درجه، حد ۲۴۰", href: "/alerts", at: "2026-11-02T03:40:00.000Z", read: true },
];

/** The moment of a demo day in Tehran time (UTC+03:30), as an ISO date. */
function demoMoment(dayOffset: number, time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  return new Date(new Date(addDays(dayOffset)).getTime() + (hour * 60 + minute - 210) * 60_000).toISOString();
}

/**
 * The live effects engine. Watches the runs started in this visit and, as each step succeeds, carries out what the
 * story registry declares for it through the other providers: messages, posts, tasks, meetings, files, chats, the
 * bell and the audit log. With «حالت زنده» on, a demo clock also starts active workflows by itself.
 * Must be mounted inside Messenger, Workspace, Chat, Calendar and KnowledgeFiles providers.
 */
export function LiveProvider({ children }: { children: ReactNode }) {
  const { runs, workflows, run: startRun } = useWorkflows();
  const messenger = useMessenger();
  const workspace = useWorkspace();
  const chat = useChat();
  const calendar = useCalendar();
  const files = useKnowledgeFiles();
  const { agents } = useAgents();
  const { connections } = useConnections();
  const { models } = useModels();
  const { live } = useDemoFlags();
  const router = useRouter();

  const [effects, setEffects] = useState<LiveEffect[]>([]);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [audit, setAudit] = useState<LiveAuditEntry[]>([]);
  // Runs that existed on arrival are history; their effects are already in the sample data.
  const [knownRunIds] = useState(() => new Set(runs.map((run) => run.id)));
  const handled = useRef(new Set<string>());
  const counter = useRef(0);
  const nextPick = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const nextId = (prefix: string) => `${prefix}-${++counter.current}`;
  const later = (ms: number, action: () => void) => {
    const timer = setTimeout(() => { timers.current.delete(timer); action(); }, ms);
    timers.current.add(timer);
  };

  // The effects below run from timers, so they read the providers' newest functions from here.
  const latest = useRef({ messenger, workspace, chat, calendar, files, agents, connections, runs, workflows, startRun, router });
  useEffect(() => { latest.current = { messenger, workspace, chat, calendar, files, agents, connections, runs, workflows, startRun, router }; });
  useEffect(() => {
    const active = timers.current;
    return () => { active.forEach(clearTimeout); active.clear(); };
  }, []);

  const notify = useCallback((icon: NotificationIcon, title: string, description?: string, href?: string) => {
    setNotifications((list) => [{ id: `ntf-${++counter.current}`, icon, title, description, href, at: new Date().toISOString(), read: false }, ...list]);
  }, []);

  /** Carries out one effect and says where it landed. */
  const perform = (spec: EffectSpec, workflow: Workflow): { href: string; detail?: string } => {
    const { messenger: chatStore, workspace: tasks, chat: assistant, calendar: agenda, files: knowledge } = latest.current;
    const sender = `جریان «${workflow.name}»`;
    switch (spec.kind) {
      case "message": {
        const { to, reply } = spec;
        chatStore.post({ threadId: to, text: spec.text, sender: `✦ ${sender}` });
        if (reply) later(replyMs, () => latest.current.messenger.post({ threadId: to, text: reply, from: "other" }));
        return { href: `/messenger/${to}`, detail: getColleagueById(to)?.role };
      }
      case "group":
        chatStore.post({ threadId: spec.groupId, text: spec.text, sender: "جریان‌ها", alert: { ...spec.alert, workflowId: workflow.id } });
        return { href: getGroupById(spec.groupId)?.href ?? "/messenger/groups", detail: spec.alert.title };
      case "channel":
        chatStore.post({ threadId: spec.channelId, text: spec.text, sender, alert: { title: workflow.name, tone: "info", fields: [], workflowId: workflow.id } });
        return { href: getGroupById(spec.channelId)?.href ?? "/messenger/channels", detail: spec.text };
      case "alert":
        chatStore.post({ threadId: "alerts", text: spec.text, alert: { ...spec.alert, workflowId: workflow.id } });
        return { href: "/messenger/alerts", detail: spec.alert.title };
      case "task": {
        const project = tasks.projects.find((item) => item.name === spec.project) ?? tasks.projects[0];
        tasks.addTask(project.id, spec.title, spec.assignee ?? currentUserId(), spec.priority, { source: "workflow", sourceName: `✦ ${workflow.name}`, dueDate: addDays(spec.dueInDays) });
        return { href: "/messenger/tasks", detail: spec.title };
      }
      case "calendar":
        agenda.addEvent({ title: spec.title, start: demoMoment(spec.dayOffset, spec.time), durationMinutes: spec.durationMinutes, place: spec.place, suggested: true });
        return { href: "/calendar", detail: spec.title };
      case "file":
        knowledge.addGenerated({ title: spec.title, source: spec.folder, collection: "ساخته‌شده با AI", kind: spec.fileKind, sizeKb: spec.sizeKb, updatedAt: new Date().toISOString(), summary: spec.summary, keywords: spec.keywords, meta: { type: "خروجی جریان", owner: workflow.name, confidentiality: "داخلی" } });
        return { href: "/knowledge", detail: `${spec.title}.${fileExtensions[spec.fileKind]}` };
      case "chat": {
        const id = assistant.addReport({ title: spec.title, prompt: spec.prompt, text: spec.text, agentName: spec.agentName, sources: spec.sources?.map((title, index) => ({ id: `live-src-${index}`, title, kind: "document" as const })) });
        return { href: `/chat/${id}`, detail: spec.title };
      }
      case "notification":
        notify("notification", spec.title, spec.description, spec.href);
        return { href: spec.href ?? "/live", detail: spec.title };
    }
  };

  const record = (kind: LiveEffect["kind"], label: string, where: { href: string; detail?: string }, run: Run, workflow: Workflow, step?: RunStep) => {
    setEffects((list) => [...list, { id: nextId("effect"), kind, runId: run.id, workflowId: workflow.id, workflowName: workflow.name, nodeId: step?.nodeId, stepLabel: step?.label, label, ...where, at: new Date().toISOString() }]);
  };

  const writeAudit = (workflow: Workflow, node: WorkflowNode, step: RunStep, result: LiveAuditEntry["result"], reason?: string) => {
    const { agents: agentList, connections: connectionList } = latest.current;
    const identity = auditIdentity(workflow);
    const agentId = node.config.agentId ?? node.config.childAgentIds?.[0];
    const connection = connectionList.find((item) => item.id === node.config.connectionId);
    const tool = connection?.tools.find((item) => item.id === node.config.toolId);
    const approval = node.kind === "approval";
    setAudit((list) => [{
      id: nextId("live-audit"), at: new Date().toISOString(), user: approval && result !== "pending" ? getCurrentUser().name : "جریان خودکار", unit: identity.unit,
      agent: agentList.find((item) => item.id === agentId)?.name ?? identity.agent,
      source: connection && tool ? `${connection.name}: ${tool.name}` : approval ? "تأیید انسانی" : node.label,
      model: step.modelName ?? "—", channel: "workflow", result, reason, maskedCount: 0, durationMs: step.durationMs ?? 0,
      action: `${workflow.name} · ${step.label}`,
    }, ...list]);
  };

  const finish = (run: Run, workflow: Workflow) => {
    const failed = run.status === "failed";
    const written = run.steps.filter((step) => step.status === "succeeded" && !["fork", "join", "condition"].includes(workflow.nodes.find((node) => node.id === step.nodeId)?.kind ?? "")).length;
    if (written > 0) record("audit", `${formatNumber(written)} رویداد در گزارش ممیزی ادمین ثبت شد`, { href: "/admin/audit", detail: "کاربر: جریان خودکار" }, run, workflow);
    if (failed) notify("failed", `جریان «${workflow.name}» ناموفق بود`, "از همان گام می‌توانید دوباره اجرا کنید.", `/workflows/${workflow.id}?tab=runs`);
    else notify("run", `جریان «${workflow.name}» انجام شد`, "فعالیت زنده را ببینید.", "/live");
  };

  // Each step acts once, as soon as it succeeds; a run that is resumed from a failed step acts only for what is new.
  useEffect(() => {
    for (const run of runs) {
      if (knownRunIds.has(run.id)) continue;
      const workflow = workflows.find((item) => item.id === run.workflowId);
      if (!workflow) continue;
      for (const step of run.steps) {
        const node = workflow.nodes.find((item) => item.id === step.nodeId);
        if (!node) continue;
        const key = `${run.id}:${step.nodeId}:${step.status}`;
        if (handled.current.has(key)) continue;
        if (step.status === "waiting-approval") {
          handled.current.add(key);
          notify("approval", `«${step.label}» منتظر تأیید شماست`, workflow.name, `/workflows/${workflow.id}`);
          writeAudit(workflow, node, step, "pending", "منتظر تأیید کاربر");
        } else if (step.status === "failed") {
          handled.current.add(key);
          if (node.kind === "approval") writeAudit(workflow, node, step, "denied", step.error);
        } else if (step.status === "succeeded") {
          handled.current.add(key);
          if (node.kind !== "fork" && node.kind !== "join" && node.kind !== "condition") writeAudit(workflow, node, step, "success");
          effectsFor({ workflow, node, step, run }).forEach((spec, index) => {
            later(index * staggerMs, () => {
              const where = perform(spec, workflow);
              record(spec.kind, spec.label ?? effectMeta[spec.kind].label, where, run, workflow, step);
            });
          });
        }
      }
      const endKey = `${run.id}:end:${run.status}`;
      if ((run.status === "succeeded" || run.status === "failed") && !handled.current.has(endKey)) {
        handled.current.add(endKey);
        later(finishDelayMs, () => finish(run, workflow));
      }
    }
    // `perform` and friends read everything current through `latest`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runs, workflows, knownRunIds, notify]);

  // The demo clock: one active scheduled or event workflow at a time, in turn. Turning «حالت زنده» off stops it.
  useEffect(() => {
    if (!live) return;
    const tick = () => {
      const { runs: allRuns, workflows: allWorkflows, startRun: start, router: nav } = latest.current;
      if (allRuns.some((run) => run.status === "running" || run.status === "waiting-approval")) return;
      const candidates = allWorkflows.filter((item) => item.status === "active" && item.nodes.length > 0 && item.triggers.some((trigger) => trigger.kind !== "manual"));
      if (candidates.length === 0) return;
      const workflow = candidates[nextPick.current++ % candidates.length];
      const cue = cueFor(workflow);
      start(workflow.id, cue.startedBy);
      notify(cue.icon, cue.title, cue.description, `/workflows/${workflow.id}`);
      toast.info(cue.title, { description: cue.description, action: { label: "مشاهده", onClick: () => nav.push(`/workflows/${workflow.id}`) } });
    };
    const first = setTimeout(tick, firstTickMs);
    const every = setInterval(tick, clockMs);
    return () => { clearTimeout(first); clearInterval(every); };
  }, [live, notify]);

  const internalNames = useMemo(() => new Set(models.filter((model) => model.isInternal).map((model) => model.name)), [models]);

  const value = useMemo<LiveContextValue>(() => ({
    effects,
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
    markRead: (id) => setNotifications((list) => list.map((item) => (item.id === id ? { ...item, read: true } : item))),
    markAllRead: () => setNotifications((list) => list.map((item) => ({ ...item, read: true }))),
    audit,
    visitRuns: runs.filter((run) => !knownRunIds.has(run.id)),
    summaryOf: (run) => {
      let tokens = 0;
      let costToman = 0;
      for (const step of run.steps) {
        const used = (step.inputTokens ?? 0) + (step.outputTokens ?? 0);
        tokens += used;
        costToman += (used / 1000) * (internalNames.has(step.modelName ?? "") ? tomanPer1kTokens.internal : tomanPer1kTokens.external);
      }
      return { runId: run.id, effects: effects.filter((item) => item.runId === run.id).length, tokens, costToman: Math.round(costToman) };
    },
  }), [effects, notifications, audit, runs, knownRunIds, internalNames]);

  return (
    <LiveContext.Provider value={value}>
      {children}
      <LiveDock />
    </LiveContext.Provider>
  );
}

export function useLive(): LiveContextValue {
  const value = useContext(LiveContext);
  if (!value) throw new Error("useLive must be used inside LiveProvider");
  return value;
}
