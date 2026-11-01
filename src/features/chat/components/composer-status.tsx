"use client";

import { BookOpenIcon, BotIcon, GlobeIcon, ShieldCheckIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/features/agents/types";
import { ConnectionIcon } from "@/features/connections/components/connection-icon";
import { useConnections } from "@/features/connections/components/connections-provider";
import { formatDate } from "@/lib/format";
import type { Notice } from "../hooks/use-send-flow";
import type { Quota } from "@/features/user-session/types";

type ComposerStatusProps = {
  agent: Agent | null;
  onLeaveAgent: () => void;
  connectionIds: string[];
  onToggleConnection: (id: string, enabled: boolean) => void;
  notice: Notice | null;
  onDismissNotice: () => void;
  onUseSuggestion: (modelId: string) => void;
  quotaExhausted: boolean;
  quota: Quota;
  attachmentProblem: string | null;
  knowledge: boolean;
  onKnowledgeOff: () => void;
  webSearch: boolean;
  onWebSearchOff: () => void;
  supervisor: boolean;
  onSupervisorOff: () => void;
};

/** Everything that must be visible before sending: Agent, connections, warnings, quota. */
export function ComposerStatus(props: ComposerStatusProps) {
  const { agent, connectionIds, notice } = props;
  const { available } = useConnections();
  const connections = available.filter((item) => connectionIds.includes(item.id));
  return (
    <div className="flex flex-col gap-2">
      {props.quotaExhausted ? (
        <Alert variant="destructive">
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>سهمیه‌ی شما تمام شده است</AlertTitle>
          <AlertDescription>تا بازنشانی سهمیه در {formatDate(props.quota.resetsAt)} نمی‌توانید پیام بفرستید.</AlertDescription>
        </Alert>
      ) : null}
      {agent && !agent.isEnabled ? (
        <Alert variant="destructive">
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>این Agent اجرا نمی‌شود</AlertTitle>
          <AlertDescription>{agent.disabledReason ?? "این Agent در دسترس نیست."} می‌توانید به گفتگوی معمولی برگردید.</AlertDescription>
        </Alert>
      ) : null}
      {notice ? (
        <Alert variant={notice.tone}>
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>{notice.title}</AlertTitle>
          <AlertDescription>
            {notice.text}
            <span className="mt-2 flex flex-wrap gap-2">
              {notice.suggestion ? <Button size="sm" onClick={() => props.onUseSuggestion(notice.suggestion!.id)}>استفاده از «{notice.suggestion.name}»</Button> : null}
              <Button size="sm" variant="outline" onClick={props.onDismissNotice}>بستن</Button>
            </span>
          </AlertDescription>
        </Alert>
      ) : null}
      {props.attachmentProblem ? (
        <Alert variant="destructive"><TriangleAlertIcon aria-hidden /><AlertDescription>{props.attachmentProblem}</AlertDescription></Alert>
      ) : null}
      {agent || connections.length > 0 || props.knowledge || props.webSearch || props.supervisor ? (
        <div className="flex flex-wrap items-center gap-2">
          {agent ? (
            <Badge variant="info" className="h-7 gap-2">
              <BotIcon aria-hidden />Agent: {agent.name}
              <button type="button" onClick={props.onLeaveAgent} aria-label="خروج از حالت Agent"><XIcon aria-hidden /></button>
            </Badge>
          ) : null}
          {props.knowledge ? (
            <Badge variant="secondary" className="h-7 gap-2">
              <BookOpenIcon aria-hidden />دانش سازمانی
              <button type="button" onClick={props.onKnowledgeOff} aria-label="خاموش کردن دانش سازمانی"><XIcon aria-hidden /></button>
            </Badge>
          ) : null}
          {props.webSearch ? (
            <Badge variant="secondary" className="h-7 gap-2">
              <GlobeIcon aria-hidden />جست‌وجوی وب
              <button type="button" onClick={props.onWebSearchOff} aria-label="خاموش کردن جست‌وجوی وب"><XIcon aria-hidden /></button>
            </Badge>
          ) : null}
          {props.supervisor ? (
            <Badge variant="secondary" className="h-7 gap-2">
              <ShieldCheckIcon aria-hidden />ناظر هوشمند
              <button type="button" onClick={props.onSupervisorOff} aria-label="خاموش کردن ناظر هوشمند"><XIcon aria-hidden /></button>
            </Badge>
          ) : null}
          {connections.map((item) => (
            <Badge key={item.id} variant="secondary" className="h-7 gap-2">
              <ConnectionIcon name={item.name} domain={item.domain} className="size-5 rounded-md" />
              {item.name}
              <button type="button" onClick={() => props.onToggleConnection(item.id, false)} aria-label={`خاموش کردن ${item.name}`}><XIcon aria-hidden /></button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
