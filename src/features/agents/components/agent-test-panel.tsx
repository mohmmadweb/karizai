"use client";

import { useState } from "react";
import { SendIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolRunCard } from "@/features/connections/components/tool-run-card";
import { getConnectionById } from "@/features/connections/data/connections";
import type { ToolRun } from "@/features/connections/types";
import { useChat } from "@/features/chat/components/chat-provider";
import { getQuota } from "@/features/user-session/data/session";
import { formatDate } from "@/lib/format";
import type { AgentDraft } from "../types";
import { useAgents } from "./agents-provider";

type TestMessage = { id: number; role: "user" | "assistant"; text: string; run?: ToolRun };

/** Tries the Agent as it is in the form. Same rules as the chat: quota, approval, and pending items do not run. */
export function AgentTestPanel({ draft, name }: { draft: AgentDraft; name: string }) {
  const { state } = useChat();
  const { skills } = useAgents();
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [text, setText] = useState("");
  const quota = getQuota();
  const exhausted = state.used >= quota.limit;
  const pending = skills.filter((skill) => draft.skillIds.includes(skill.id) && skill.approval !== "approved");

  function send() {
    if (!text.trim() || exhausted) return;
    const first = draft.tools[0];
    const tool = first ? getConnectionById(first.connectionId)?.tools.find((item) => item.id === first.toolId) : undefined;
    const run: ToolRun | undefined = tool && tool.userCanUse
      ? { id: `run-test-${messages.length}`, connectionId: first.connectionId, toolId: tool.id, toolName: tool.name, description: tool.description, inputs: tool.sampleInputs, status: tool.requiresApproval ? "awaiting-approval" : "succeeded", result: "اطلاعات درخواست‌شده با موفقیت دریافت شد." }
      : undefined;
    const id = messages.length + 1;
    setMessages((list) => [
      ...list,
      { id, role: "user", text },
      { id: id + 1, role: "assistant", text: `(آزمایش ${name || "عامل"}) با دستورالعمل فعلی‌ام به «${text.slice(0, 40)}» چنین پاسخ می‌دهم.`, run },
    ]);
    setText("");
  }

  const setRun = (id: number, status: ToolRun["status"]) =>
    setMessages((list) => list.map((item) => (item.id === id && item.run ? { ...item, run: { ...item.run, status, result: "اطلاعات درخواست‌شده با موفقیت دریافت شد." } } : item)));

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4">
      {exhausted ? <Alert variant="destructive"><AlertDescription>سهمیه‌ی شما تمام شده است؛ تا {formatDate(quota.resetsAt)} آزمایش ممکن نیست.</AlertDescription></Alert> : null}
      {pending.length > 0 ? <Alert variant="warning"><AlertDescription>مهارت‌های در انتظار تأیید در آزمایش استفاده نمی‌شوند.</AlertDescription></Alert> : null}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto" aria-live="polite">
        {messages.length === 0 ? <p className="py-6 text-center text-body text-muted-foreground">پیامی بفرستید تا عامل را با تنظیمات فعلی فرم آزمایش کنید.</p> : null}
        {messages.map((item) => (
          <div key={item.id} className="flex flex-col gap-2">
            {item.run ? <ToolRunCard run={item.run} onApprove={() => setRun(item.id, "succeeded")} onReject={() => setRun(item.id, "rejected")} /> : null}
            <div className={item.role === "user" ? "w-fit rounded-xl bg-primary px-3 py-2 text-primary-foreground" : "rounded-xl bg-muted px-3 py-2"}>{item.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={(event) => { event.preventDefault(); send(); }} className="flex gap-2">
        <Input value={text} onChange={(event) => setText(event.target.value)} disabled={exhausted} aria-label="پیام آزمایشی" placeholder="پیام آزمایشی..." />
        <Button type="submit" size="icon" aria-label="ارسال" disabled={exhausted || !text.trim()}><SendIcon aria-hidden className="rtl:-scale-x-100" /></Button>
      </form>
    </div>
  );
}
