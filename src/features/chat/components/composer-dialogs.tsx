"use client";

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

type ComposerDialogsProps = {
  /** Name of the Agent waiting for the "new conversation or continue" choice. */
  agentChoice: string | null;
  onAgentNew: () => void;
  onAgentContinue: () => void;
  onAgentCancel: () => void;
};

export function ComposerDialogs(props: ComposerDialogsProps) {
  return (
    <>
      <AlertDialog open={props.agentChoice !== null} onOpenChange={(open) => !open && props.onAgentCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>شروع «{props.agentChoice}» در گفتگوی جدید؟</AlertDialogTitle>
            <AlertDialogDescription>این گفتگو پیام‌هایی دارد. Agent فقط پیام‌های بعد از انتخابش را می‌بیند؛ برای نتیجه‌ی بهتر پیشنهاد می‌کنیم گفتگوی جدا شروع کنید.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={props.onAgentContinue}>ادامه در همین گفتگو</AlertDialogCancel>
            <AlertDialogAction onClick={props.onAgentNew}>گفتگوی جدید</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
