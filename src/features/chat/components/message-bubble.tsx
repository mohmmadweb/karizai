"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, RefreshCwIcon, TriangleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Message, MessageAction, MessageActions, MessageContent } from "@/components/ui/message";
import { ToolRunCard } from "@/features/connections/components/tool-run-card";
import type { Message as ChatMessage } from "../types";
import { AnswerDetails } from "./answer-details";
import { AttachmentChip } from "./attachment-chip";
import { StructuredResultView } from "./structured-result";
import { TimelineView } from "./timeline-view";

type MessageBubbleProps = {
  message: ChatMessage;
  onApprove: () => void;
  onReject: () => void;
  onRetry: () => void;
};

export function MessageBubble({ message, onApprove, onReject, onRetry }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  if (message.role === "user") {
    return (
      <Message className="flex-col items-start gap-2">
        {message.attachments.length > 0 ? (
          <div className="flex flex-wrap gap-2">{message.attachments.map((item) => <AttachmentChip key={item.id} attachment={item} />)}</div>
        ) : null}
        {message.text ? <MessageContent className="max-w-[85%] whitespace-pre-wrap rounded-3xl bg-muted px-5 py-3 text-body">{message.text}</MessageContent> : null}
      </Message>
    );
  }

  function copy() {
    void navigator.clipboard?.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const waiting = message.status === "streaming" && !message.text && !message.toolRun && !message.timeline;
  return (
    <Message className="flex-col gap-3">
      {message.timeline ? <TimelineView steps={message.timeline} /> : null}
      {message.toolRun ? <ToolRunCard run={message.toolRun} onApprove={onApprove} onReject={onReject} /> : null}
      {waiting ? <Loader variant="typing" size="md" /> : null}
      {message.text ? <MessageContent markdown className="chat-markdown bg-transparent p-0 text-body">{message.text}</MessageContent> : null}
      {message.structured ? <StructuredResultView result={message.structured} /> : null}
      {message.status === "stopped" ? <p className="text-caption text-muted-foreground">پاسخ متوقف شد.</p> : null}
      {message.status === "error" ? (
        <Alert variant="destructive">
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>پاسخ کامل نشد</AlertTitle>
          <AlertDescription>
            {message.error}
            <Button size="sm" variant="outline" className="mt-2 w-fit" onClick={onRetry}>تلاش دوباره</Button>
          </AlertDescription>
        </Alert>
      ) : null}
      {message.status !== "streaming" ? (
        <>
          <MessageActions>
            <MessageAction tooltip={copied ? "کپی شد" : "کپی پاسخ"}>
              <Button variant="ghost" size="icon-sm" aria-label="کپی پاسخ" onClick={copy}>{copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}</Button>
            </MessageAction>
            <MessageAction tooltip="پاسخ دوباره">
              <Button variant="ghost" size="icon-sm" aria-label="پاسخ دوباره" onClick={onRetry}><RefreshCwIcon aria-hidden /></Button>
            </MessageAction>
          </MessageActions>
          <AnswerDetails message={message} />
        </>
      ) : null}
    </Message>
  );
}
