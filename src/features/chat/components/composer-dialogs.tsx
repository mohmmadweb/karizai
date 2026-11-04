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
  sensitiveReason: string | null;
  /** The message as an external model would see it. */
  maskedPreview?: string | null;
  onMaskAndSend: () => void;
  onSendInternal: () => void;
  onCancelSensitive: () => void;
  /** Name of the Agent waiting for the "new conversation or continue" choice. */
  agentChoice: string | null;
  onAgentNew: () => void;
  onAgentContinue: () => void;
  onAgentCancel: () => void;
};

export function ComposerDialogs(props: ComposerDialogsProps) {
  return (
    <>
      <AlertDialog open={props.sensitiveReason !== null} onOpenChange={(open) => !open && props.onCancelSensitive()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>این پیام شاید اطلاعات حساس دارد</AlertDialogTitle>
            <AlertDialogDescription>{props.sensitiveReason} یکی از راه‌ها را انتخاب کنید: مقدارهای حساس با نشانه‌ی بی‌معنی جایگزین می‌شوند و مقدار اصلی هرگز به مدل بیرونی نمی‌رسد؛ یا پیام فقط به مدل داخلی سازمان فرستاده می‌شود.</AlertDialogDescription>
          </AlertDialogHeader>
          {props.maskedPreview ? <p className="rounded-lg bg-muted p-3 text-body-sm"><span className="text-muted-foreground">پس از پوشاندن: </span>{props.maskedPreview}</p> : null}
          <AlertDialogFooter>
            <AlertDialogCancel>ویرایش پیام</AlertDialogCancel>
            <AlertDialogAction variant="outline" onClick={props.onSendInternal}>ارسال به مدل داخلی</AlertDialogAction>
            <AlertDialogAction onClick={props.onMaskAndSend}>پوشاندن و ارسال</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={props.agentChoice !== null} onOpenChange={(open) => !open && props.onAgentCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>شروع «{props.agentChoice}» در گفتگوی جدید؟</AlertDialogTitle>
            <AlertDialogDescription>این گفتگو پیام‌هایی دارد. عامل فقط پیام‌های بعد از انتخابش را می‌بیند؛ برای نتیجه‌ی بهتر پیشنهاد می‌کنیم گفتگوی جدا شروع کنید.</AlertDialogDescription>
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
