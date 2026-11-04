"use client";

import { TriangleAlertIcon, WifiOffIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/features/agents/types";
import { formatDate } from "@/lib/format";
import type { Notice } from "../hooks/use-send-flow";
import type { Quota } from "@/features/user-session/types";

type ComposerStatusProps = {
  agent: Agent | null;
  notice: Notice | null;
  onDismissNotice: () => void;
  onUseSuggestion: (modelId: string) => void;
  quotaExhausted: boolean;
  quota: Quota;
  attachmentProblem: string | null;
  /** Internet is cut (admin «شبیه‌سازی قطع اینترنت»). */
  offline: boolean;
};

/** Warnings that must be visible before sending: quota, Agent state, notices, attachment problems. */
export function ComposerStatus(props: ComposerStatusProps) {
  const { agent, notice } = props;
  return (
    <div className="flex flex-col gap-2">
      {props.offline ? (
        <Alert variant="warning">
          <WifiOffIcon aria-hidden />
          <AlertTitle>اتصال اینترنت قطع است؛ فقط مدل‌های داخلی پاسخ می‌دهند</AlertTitle>
          <AlertDescription>درخواست‌هایی که به مدل بیرونی می‌رفتند، به مدل داخلی سازمان سپرده می‌شوند و زیر پاسخ نوشته می‌شود.</AlertDescription>
        </Alert>
      ) : null}
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
          <AlertTitle>این عامل اجرا نمی‌شود</AlertTitle>
          <AlertDescription>{agent.disabledReason ?? "این عامل در دسترس نیست."} می‌توانید به گفتگوی معمولی برگردید.</AlertDescription>
        </Alert>
      ) : null}
      {notice ? (
        <Alert variant={notice.tone}>
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>{notice.title}</AlertTitle>
          <AlertDescription>
            {notice.text}
            <span className="mt-2 flex flex-wrap gap-2">
              {notice.suggestions?.map((model) => <Button key={model.id} size="sm" onClick={() => props.onUseSuggestion(model.id)}>استفاده از «{model.name}»</Button>)}
              {notice.suggestion ? <Button size="sm" onClick={() => props.onUseSuggestion(notice.suggestion!.id)}>استفاده از «{notice.suggestion.name}»</Button> : null}
              <Button size="sm" variant="outline" onClick={props.onDismissNotice}>بستن</Button>
            </span>
          </AlertDescription>
        </Alert>
      ) : null}
      {props.attachmentProblem ? (
        <Alert variant="destructive"><TriangleAlertIcon aria-hidden /><AlertDescription>{props.attachmentProblem}</AlertDescription></Alert>
      ) : null}
    </div>
  );
}
