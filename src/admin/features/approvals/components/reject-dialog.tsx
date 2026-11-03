"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type Props = { title: string | null; onOpenChange: (open: boolean) => void; onReject: (reason: string) => void };

/** «رد با دلیل»: the reason goes back to the requester. */
export function RejectDialog({ title, onOpenChange, onReject }: Props) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string>();

  function submit(event: FormEvent) {
    event.preventDefault();
    if (reason.trim().length < 5) return setError("دلیل را در یک جمله بنویسید تا درخواست‌دهنده بداند چه باید بکند.");
    onReject(reason.trim());
    setReason("");
    setError(undefined);
  }

  return (
    <Dialog open={title !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>رد درخواست «{title}»</DialogTitle>
          <DialogDescription>دلیل برای درخواست‌دهنده فرستاده می‌شود.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="flex flex-col gap-6">
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="reject-reason">دلیل رد</FieldLabel>
            <Textarea id="reject-reason" rows={3} value={reason} aria-invalid={Boolean(error)} placeholder="مثلاً: ابزار نوشتنی بدون سقف مبلغ است؛ سقف را تعیین کنید." onChange={(e) => setReason(e.target.value)} />
            <FieldDescription>کوتاه و روشن بنویسید چه چیزی باید اصلاح شود.</FieldDescription>
            <FieldError>{error}</FieldError>
          </Field>
          <DialogFooter>
            <Button type="submit" variant="destructive">رد درخواست</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
