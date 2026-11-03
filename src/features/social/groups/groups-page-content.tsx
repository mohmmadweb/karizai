"use client";

import { useRef, useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { currentUserId } from "@/features/workspace/lib/people";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AiAction } from "../components/ai-dialog";
import { getAgentMember } from "../data/agents";
import { getGroupMessages, getGroups } from "../data/groups";
import { agentAnswer, mentionedAgentId } from "../lib/agent-replies";
import type { Group, GroupMessage } from "../types";
import { AddAgentDialog, CreateGroupDialog } from "./group-dialogs";
import { GroupSummaryAnswer } from "./group-summary-answer";
import { GroupView } from "./group-view";

/** «گروه‌ها»: the list beside the selected group. New groups and messages stay until reload. */
export function GroupsPageContent() {
  const [groups, setGroups] = useState(getGroups);
  const [messages, setMessages] = useState(getGroupMessages);
  const [selectedId, setSelectedId] = useState(groups[0].id);
  const [creating, setCreating] = useState(false);
  const [addingAgent, setAddingAgent] = useState(false);
  const counter = useRef(0);
  const selected = groups.find((g) => g.id === selectedId) ?? groups[0];
  const post = (message: Omit<GroupMessage, "id" | "createdAt">) => setMessages((list) => [...list, { ...message, id: `gm-new-${++counter.current}`, createdAt: new Date().toISOString() }]);

  function send(text: string) {
    const group = selected;
    post({ groupId: group.id, authorId: currentUserId(), text });
    const agentId = mentionedAgentId(text);
    if (!agentId) return;
    if (!group.agentIds.includes(agentId)) {
      post({ groupId: group.id, authorId: "system", system: true, text: `«${getAgentMember(agentId)?.name}» عضو این گروه نیست؛ از «افزودن عامل به گروه» اضافه کنید.` });
      return;
    }
    const answer = agentAnswer(agentId, text);
    window.setTimeout(() => post({ groupId: group.id, authorId: agentId, text: answer.text, sources: answer.sources }), 900);
  }

  function create(name: string, description: string, agentIds: string[]) {
    const group: Group = { id: `grp-new-${++counter.current}`, name, description, memberCount: 1, agentIds, summary: { unread: 0, topic: "گروه تازه ساخته شده است", points: ["هنوز پیامی در گروه نیست."], openDecision: "ندارد", actions: [] } };
    setGroups((list) => [group, ...list]);
    setSelectedId(group.id);
    toast.success(`گروه «${name}» ساخته شد`);
  }

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="گروه‌ها" description="گفتگوی تیمی با همکاران و عامل‌های هوشمند" action={<Button onClick={() => setCreating(true)}><PlusIcon data-icon="inline-start" aria-hidden />ایجاد گروه</Button>} />
      <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <ul className="flex flex-col gap-2" aria-label="فهرست گروه‌ها">
          {groups.map((group) => (
            <li key={group.id} className={cn("flex items-center gap-2 rounded-xl border bg-card p-3", group.id === selected.id && "border-primary ring-1 ring-primary/30")}>
              <button type="button" aria-current={group.id === selected.id ? "true" : undefined} onClick={() => setSelectedId(group.id)} className="flex min-w-0 flex-1 items-center gap-2 rounded-md text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-label text-primary">{group.name[0]}</span>
                <span className="min-w-0"><span className="block truncate text-label">{group.name}</span><span className="block text-caption text-muted-foreground">{formatNumber(group.memberCount)} عضو{group.summary.unread > 0 ? ` · ${formatNumber(group.summary.unread)} خوانده‌نشده` : ""}</span></span>
              </button>
              <AiAction label="خلاصه" size="xs" context={`گروه ${group.name}`}><GroupSummaryAnswer group={group} /></AiAction>
            </li>
          ))}
        </ul>
        <GroupView key={selected.id} group={selected} messages={messages.filter((m) => m.groupId === selected.id)} onSend={send} onAddAgent={() => setAddingAgent(true)} />
      </div>
      <CreateGroupDialog open={creating} onOpenChange={setCreating} onCreate={create} />
      <AddAgentDialog key={selected.id} open={addingAgent} onOpenChange={setAddingAgent} groupName={selected.name} current={selected.agentIds} onAdd={(ids) => {
        setGroups((list) => list.map((g) => (g.id === selected.id ? { ...g, agentIds: [...g.agentIds, ...ids] } : g)));
        toast.success(`${formatNumber(ids.length)} عامل به گروه «${selected.name}» اضافه شد`);
      }} />
    </div>
  );
}
