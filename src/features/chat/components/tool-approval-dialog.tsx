"use client";

import { WrenchIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useChat } from "./chat-provider";

/** Window that asks for approval before a tool runs: name, what it does, and its inputs. */
export function ToolApprovalDialog({ conversationId }: { conversationId: string }) {
  const { state, approveTool, rejectTool, decideStep } = useChat();
  const messages = state.messages[conversationId] ?? [];
  const message = messages.find((item) => item.toolRun?.status === "awaiting-approval");
  // A step of a multi-agent answer can ask for approval too.
  const stepMessage = messages.find((item) => item.timeline?.some((step) => step.status === "waiting-approval"));
  const step = stepMessage?.timeline?.find((item) => item.status === "waiting-approval");
  const run = message?.toolRun ?? (step?.approval ? { toolName: step.approval.toolName, description: step.approval.description, inputs: step.approval.inputs } : undefined);

  return (
    <AlertDialog open={Boolean(run)} onOpenChange={() => undefined}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2"><WrenchIcon className="size-4" aria-hidden />اجرای «{run?.toolName}» نیاز به تأیید شما دارد</AlertDialogTitle>
          <AlertDialogDescription>{run?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <dl className="grid gap-1 rounded-lg bg-muted p-3 text-body-sm">
          {run?.inputs.map((input) => (
            <div key={input.label} className="flex gap-2"><dt className="text-muted-foreground">{input.label}:</dt><dd>{input.value}</dd></div>
          ))}
        </dl>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => (message ? rejectTool(conversationId, message.id) : stepMessage && decideStep(stepMessage.id, false))}>رد کردن</AlertDialogCancel>
          <AlertDialogAction onClick={() => (message ? approveTool(conversationId, message.id) : stepMessage && decideStep(stepMessage.id, true))}>تأیید و اجرا</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
