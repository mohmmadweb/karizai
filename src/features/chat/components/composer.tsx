"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptInput, PromptInputActions, PromptInputAction, PromptInputTextarea } from "@/components/ui/prompt-input";
import { useAgents } from "@/features/agents/components/agents-provider";
import type { Agent } from "@/features/agents/types";
import { useConnections } from "@/features/connections/components/connections-provider";
import type { Connection } from "@/features/connections/types";
import { getQuota } from "@/features/user-session/data/session";
import { useDemoFlags } from "@/lib/demo-flags";
import { useAttachments } from "../hooks/use-attachments";
import { useSendFlow } from "../hooks/use-send-flow";
import { emptySettings } from "../lib/chat-reducer";
import { AttachmentChip } from "./attachment-chip";
import { useChat } from "./chat-provider";
import { ComposerDialogs } from "./composer-dialogs";
import { ComposerPills } from "./composer-pills";
import { ComposerStatus } from "./composer-status";
import { ComposerToolbar } from "./composer-toolbar";
import { KnowledgeFileDialog } from "./knowledge-file-dialog";
import { MaskHint } from "./mask-hint";
import { UsageRing } from "./usage-ring";

/** Connections an Agent may use: only its own tools, and only those the user can also use. */
function agentConnections(agent: Agent, available: Connection[]): Connection[] {
  return available
    .map((connection) => ({
      ...connection,
      tools: connection.tools.filter(
        (tool) => tool.userCanUse && agent.tools.some((ref) => ref.connectionId === connection.id && ref.toolId === tool.id),
      ),
    }))
    .filter((connection) => connection.tools.length > 0);
}

/** ChatGPT-style message box: one rounded field with its controls inside. */
export function Composer({ conversationId }: { conversationId: string | null }) {
  const router = useRouter();
  const { state, prefill, setPrefill, createConversation, updateSettings, send, stop } = useChat();
  const { agents } = useAgents();
  const { available } = useConnections();
  const quota = getQuota();
  const attachments = useAttachments();
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentChoice, setAgentChoice] = useState<Agent | null>(null);
  const [filesOpen, setFilesOpen] = useState(false);
  const { offline } = useDemoFlags();

  // A page can hand over text for a new conversation (home starters, knowledge).
  const [consumed, setConsumed] = useState("");
  if (conversationId === null && prefill && prefill !== consumed) {
    setConsumed(prefill);
    setText(prefill);
  } else if (!prefill && consumed) {
    setConsumed("");
  }
  useEffect(() => {
    if (conversationId === null && prefill) setPrefill("");
  }, [conversationId, prefill, setPrefill]);

  const conversation = state.conversations.find((item) => item.id === conversationId);
  const settings = conversation?.settings ?? state.draft;
  const messages = conversationId ? (state.messages[conversationId] ?? []) : [];
  const streaming = messages.at(-1)?.status === "streaming" ? messages.at(-1) : undefined;
  const agent = agents.find((item) => item.id === settings.agentId) ?? null;
  // Connections the user switched on work together with the Agent's own tools.
  const chosenConnections = available.filter((item) => settings.connectionIds.includes(item.id));
  const agentOwn = agent ? agentConnections(agent, available) : [];
  const enabledConnections = [...agentOwn, ...chosenConnections.filter((item) => !agentOwn.some((own) => own.id === item.id))];
  const exhausted = state.used >= quota.limit;

  const flow = useSendFlow({
    settings,
    agent,
    connections: enabledConnections,
    onSend: (ready) => {
      const id = conversationId ?? createConversation((ready.sentText || ready.attachments[0]?.name || "").slice(0, 40));
      send({ conversationId: id, ...ready, agent, connections: enabledConnections, webSearch: settings.webSearch, knowledge: settings.knowledge, supervisor: settings.supervisor, optimizer: Boolean(settings.optimizer) });
      setText("");
      attachments.clear();
      if (!conversationId) router.replace(`/chat/${id}`);
    },
  });

  const update = (patch: Parameters<typeof updateSettings>[1]) => updateSettings(conversationId, patch);
  const toggleConnection = (id: string, on: boolean) =>
    update({ connectionIds: on ? [...settings.connectionIds, id] : settings.connectionIds.filter((item) => item !== id) });
  const canSend = (text.trim().length > 0 || attachments.items.length > 0) && !attachments.busy && !attachments.failed && !streaming && !exhausted;

  function submit() {
    if (canSend) flow.attempt(text.trim(), attachments.items);
  }

  function onTextChange(value: string) {
    if (/(^|\s)[@/]$/.test(value)) {
      setText(value.slice(0, -1));
      setMenuOpen(true);
      setAgentOpen(true);
      return;
    }
    setText(value);
  }

  function selectAgent(next: Agent) {
    setAgentOpen(false);
    setMenuOpen(false);
    if (messages.length > 0 && conversationId) setAgentChoice(next);
    else update({ agentId: next.id });
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 page-gutter pb-3">
      <ComposerStatus
        agent={agent}
        notice={flow.notice}
        onDismissNotice={flow.dismissNotice}
        onUseSuggestion={(modelId) => { update({ model: modelId }); flow.dismissNotice(); }}
        quotaExhausted={exhausted}
        quota={quota}
        attachmentProblem={attachments.problem}
        offline={offline}
      />
      <MaskHint text={text} />
      <PromptInput value={text} onValueChange={onTextChange} onSubmit={submit} isLoading={Boolean(streaming)} disabled={exhausted}>
        {attachments.items.length > 0 ? (
          <div className="flex flex-col gap-1 p-2">
            <div className="flex flex-wrap gap-2">
              {attachments.items.map((item) => <AttachmentChip key={item.id} attachment={item} onRemove={() => attachments.remove(item.id)} />)}
            </div>
            <p className="text-caption text-muted-foreground">پیوست‌ها فقط در همین گفتگو استفاده می‌شوند.</p>
          </div>
        ) : null}
        <PromptInputTextarea aria-label="پیام شما" placeholder={exhausted ? "سهمیه‌ی شما تمام شده است" : messages.length === 0 ? "پیام خود را بنویسید؛ با @ عامل و با / اسکیل را انتخاب کنید" : "پیام خود را بنویسید؛ با @ عامل و با / اسکیل را انتخاب کنید"} />
        <PromptInputActions className="mt-1 items-center justify-between">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
            <ComposerToolbar
              connectionIds={settings.connectionIds}
              onToggleConnection={toggleConnection}
              agents={agents}
              menuOpen={menuOpen}
              onMenuOpenChange={setMenuOpen}
              agentOpen={agentOpen}
              onAgentOpenChange={setAgentOpen}
              onAgentSelect={selectAgent}
              knowledge={settings.knowledge}
              onKnowledgeChange={(on) => update({ knowledge: on })}
              webSearch={settings.webSearch}
              onWebSearchChange={(on) => update({ webSearch: on })}
              supervisor={settings.supervisor}
              onSupervisorChange={(on) => update({ supervisor: on })}
              onFiles={attachments.add}
              onKnowledgeFile={() => setFilesOpen(true)}
              optimizer={Boolean(settings.optimizer)}
              onOptimizerChange={(on) => update({ optimizer: on })}
              disabled={exhausted}
            />
            <ComposerPills
              agent={agent}
              onLeaveAgent={() => update({ agentId: null })}
              connectionIds={settings.connectionIds}
              onToggleConnection={toggleConnection}
              knowledge={settings.knowledge}
              onKnowledgeOff={() => update({ knowledge: false })}
              webSearch={settings.webSearch}
              onWebSearchOff={() => update({ webSearch: false })}
              supervisor={settings.supervisor}
              onSupervisorOff={() => update({ supervisor: false })}
              optimizer={Boolean(settings.optimizer)}
              onOptimizerOff={() => update({ optimizer: false })}
            />
          </div>
          <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
            <UsageRing quota={quota} used={state.used} />
          {streaming && conversationId ? (
              <PromptInputAction tooltip="توقف پاسخ">
                <Button type="button" size="icon" className="rounded-full" aria-label="توقف پاسخ" onClick={() => stop(conversationId, streaming.id)}><SquareIcon aria-hidden className="fill-current" /></Button>
              </PromptInputAction>
            ) : (
              <PromptInputAction tooltip="ارسال">
                <Button type="button" size="icon" className="rounded-full" aria-label="ارسال" disabled={!canSend} onClick={submit}><ArrowUpIcon aria-hidden /></Button>
              </PromptInputAction>
            )}
            </div>
        </PromptInputActions>
      </PromptInput>
      <ComposerDialogs
        sensitiveReason={flow.sensitiveReason}
        maskedPreview={flow.maskedPreview}
        onMaskAndSend={flow.maskAndSend}
        onSendInternal={flow.sendInternal}
        onCancelSensitive={flow.cancelSensitive}
        agentChoice={agentChoice?.name ?? null}
        onAgentNew={() => {
          if (agentChoice) updateSettings(null, { ...emptySettings, agentId: agentChoice.id });
          setAgentChoice(null);
          router.push("/chat");
        }}
        onAgentContinue={() => { if (agentChoice) update({ agentId: agentChoice.id }); setAgentChoice(null); }}
        onAgentCancel={() => setAgentChoice(null)}
      />
      <KnowledgeFileDialog open={filesOpen} onOpenChange={setFilesOpen} onPick={attachments.addKnown} />
    </div>
  );
}
