"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import { getInitialMessages } from "../data/messages";
import { alertForRun, notifiesSomeone } from "../lib/run-alert";
import { alertsThreadId, flowsThreadId, type MessengerMessage } from "../types";

type MessengerContextValue = {
  messages: MessengerMessage[];
  messagesOf: (threadId: string) => MessengerMessage[];
  unreadOf: (threadId: string) => number;
  unreadTotal: number;
  /** The newest message of a chat, for the preview in the chat list. */
  lastOf: (threadId: string) => MessengerMessage | undefined;
  /** Adds the user's own message; it stays in the page only until it is reloaded. */
  send: (threadId: string, text: string) => void;
  markRead: (threadId: string) => void;
};

const MessengerContext = createContext<MessengerContextValue | null>(null);

/** Messages of the messenger, in memory. A finished workflow run that notifies someone adds an alert. */
export function MessengerProvider({ children }: { children: ReactNode }) {
  const { workflows, runs } = useWorkflows();
  const [stored, setStored] = useState(getInitialMessages);
  const [readAlertIds, setReadAlertIds] = useState<string[]>([]);
  const counter = useRef(0);
  // Runs that existed on arrival already have their alerts in the seed.
  const [knownRunIds] = useState(() => new Set(runs.map((run) => run.id)));

  const value = useMemo<MessengerContextValue>(() => {
    const fromRuns: MessengerMessage[] = [];
    for (const run of runs) {
      if ((run.status !== "succeeded" && run.status !== "failed") || knownRunIds.has(run.id)) continue;
      const workflow = workflows.find((item) => item.id === run.workflowId);
      if (!workflow) continue;
      const createdAt = run.endedAt ?? run.startedAt;
      const failed = run.status === "failed";
      const report = { ...alertForRun(workflow, run), ...(failed ? { title: `اجرای جریان «${workflow.name}» ناموفق بود`, tone: "warning" as const } : {}) };
      const make = (threadId: string, text: string, alert = report): MessengerMessage => ({ id: `msg-${threadId}-${run.id}`, threadId, from: "system", read: readAlertIds.includes(`msg-${threadId}-${run.id}`), createdAt, text, alert });
      fromRuns.push(make(flowsThreadId, failed ? `اجرای جریان «${workflow.name}» به خطا خورد.` : `جریان «${workflow.name}» با موفقیت اجرا شد.`));
      if (!failed && notifiesSomeone(workflow)) fromRuns.push(make(alertsThreadId, `جریان «${workflow.name}» برای شما پیام فرستاد.`));
    }
    const messages = [...stored, ...fromRuns];
    const unread = (item: MessengerMessage) => !item.read && item.from !== "me";
    return {
      messages,
      messagesOf: (threadId) => messages.filter((item) => item.threadId === threadId).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      unreadOf: (threadId) => messages.filter((item) => item.threadId === threadId && unread(item)).length,
      unreadTotal: messages.filter(unread).length,
      lastOf: (threadId) => messages.filter((item) => item.threadId === threadId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0],
      send: (threadId, text) => setStored((list) => [...list, { id: `msg-me-${++counter.current}`, threadId, from: "me", read: true, createdAt: new Date().toISOString(), text }]),
      markRead: (threadId) => {
        setStored((list) => (list.some((item) => item.threadId === threadId && !item.read) ? list.map((item) => (item.threadId === threadId ? { ...item, read: true } : item)) : list));
        const ids = fromRuns.filter((item) => item.threadId === threadId && !item.read).map((item) => item.id);
        if (ids.length > 0) setReadAlertIds((list) => [...list, ...ids]);
      },
    };
  }, [stored, runs, workflows, knownRunIds, readAlertIds]);

  return <MessengerContext.Provider value={value}>{children}</MessengerContext.Provider>;
}

export function useMessenger(): MessengerContextValue {
  const value = useContext(MessengerContext);
  if (!value) throw new Error("useMessenger must be used inside MessengerProvider");
  return value;
}
