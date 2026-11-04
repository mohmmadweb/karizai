"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryParam } from "@/lib/use-query-param";
import { BellIcon, UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { FilterPill, MotoSearch, PaneHeader, RoundFab, RoundIconButton, TwoPaneShell } from "@/components/shared/moto/moto";
import { useMessenger } from "@/features/messenger/components/messenger-provider";
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
  // `?id=` (from the chat list or the sidebar) opens that group.
  const requested = useQueryParam("id");
  const [selectedId, setSelectedId] = useState<string | null>(() => (requested && groups.some((g) => g.id === requested) ? requested : null));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [newest, setNewest] = useState(true);
  const [seenRequest, setSeenRequest] = useState(requested);
  if (requested !== seenRequest) {
    setSeenRequest(requested);
    if (requested && groups.some((g) => g.id === requested)) setSelectedId(requested);
  }
  const { messagesOf, markRead } = useMessenger();
  const [creating, setCreating] = useState(false);
  const [addingAgent, setAddingAgent] = useState(false);
  const counter = useRef(0);
  const selected = groups.find((g) => g.id === selectedId) ?? null;
  const selectedKey = selected?.id ?? "";
  // What workflows announced in the group during this visit, for example the pricing workflow in «فروش».
  const announcements: GroupMessage[] = messagesOf(selectedKey).map((item) => ({ id: item.id, groupId: selectedKey, authorId: "workflows", createdAt: item.createdAt, text: item.text, alert: item.alert }));
  useEffect(() => { if (selectedKey) markRead(selectedKey); }, [selectedKey, announcements.length, markRead]);
  const post = (message: Omit<GroupMessage, "id" | "createdAt">) => setMessages((list) => [...list, { ...message, id: `gm-new-${++counter.current}`, createdAt: new Date().toISOString() }]);

  function send(text: string) {
    const group = selected;
    if (!group) return;
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

  const shownGroups = groups.filter((g) => (!query.trim() || g.name.includes(query.trim())) && (filter === "all" || g.summary.unread > 0));
  if (!newest) shownGroups.reverse();

  const list = (
    <>
      <PaneHeader
        title="گروه‌ها"
        icon={UsersIcon}
        tools={<RoundIconButton label="اعلان‌ها" icon={BellIcon} href="/alerts" />}
        search={<MotoSearch value={query} onChange={setQuery} placeholder="جستجوی گروه‌ها" className="sm:max-w-none" />}
        filters={<>
          <FilterPill label="نمایش" value={filter} options={[{ value: "all", label: "همه" }, { value: "unread", label: "خوانده‌نشده" }]} onChange={setFilter} />
          <FilterPill label="ترتیب" sort value={newest ? "new" : "old"} options={[{ value: "new", label: "جدیدترین" }, { value: "old", label: "قدیمی‌ترین" }]} onChange={(v) => setNewest(v === "new")} />
        </>}
      />
      <ul className="flex flex-col gap-0.5 p-2 pb-20" aria-label="فهرست گروه‌ها">
        {shownGroups.length === 0 ? <li className="px-2 py-3 text-body-sm text-muted-foreground">گروهی پیدا نشد.</li> : null}
        {shownGroups.map((group) => (
          <li key={group.id} className={cn("flex items-center gap-2 rounded-lg p-2 hover:bg-muted", group.id === selectedKey && "bg-muted")}>
            <button type="button" aria-current={group.id === selectedKey ? "true" : undefined} onClick={() => setSelectedId(group.id)} className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-label text-primary">{group.name[0]}</span>
              <span className="min-w-0"><span className="block truncate text-label">{group.name}</span><span className="block truncate text-caption text-muted-foreground">{formatNumber(group.memberCount)} عضو{group.summary.unread > 0 ? ` · ${formatNumber(group.summary.unread)} خوانده‌نشده` : ""}</span></span>
            </button>
            <AiAction label="خلاصه" size="xs" context={`گروه ${group.name}`}><GroupSummaryAnswer group={group} /></AiAction>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <>
      <TwoPaneShell list={list} hasOpenItem={selected !== null} emptyText="یک گروه را انتخاب کنید" fab={<RoundFab label="ایجاد گروه" onClick={() => setCreating(true)} />}>
        {selected ? <GroupView key={selected.id} group={selected} messages={[...messages.filter((m) => m.groupId === selected.id), ...announcements].sort((a, b) => a.createdAt.localeCompare(b.createdAt))} onSend={send} onAddAgent={() => setAddingAgent(true)} onBack={() => setSelectedId(null)} /> : null}
      </TwoPaneShell>
      <CreateGroupDialog open={creating} onOpenChange={setCreating} onCreate={create} />
      {selected ? <AddAgentDialog key={selected.id} open={addingAgent} onOpenChange={setAddingAgent} groupName={selected.name} current={selected.agentIds} onAdd={(ids) => {
        setGroups((list) => list.map((g) => (g.id === selected.id ? { ...g, agentIds: [...g.agentIds, ...ids] } : g)));
        toast.success(`${formatNumber(ids.length)} عامل به گروه «${selected.name}» اضافه شد`);
      }} /> : null}
    </>
  );
}
