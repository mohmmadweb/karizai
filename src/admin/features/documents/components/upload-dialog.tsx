"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatBytes, formatNumber } from "@/admin/lib/format";
import { simulateRequest } from "@/lib/simulate-request";
import { formatGroups, getUploadLimits } from "../data/limits";
import { useDocuments } from "../hooks/use-documents";
import { checkFile } from "../lib/validation";

type Picked = { name: string; sizeBytes: number; error?: string };

function UploadForm({ onClose }: { onClose: () => void }) {
  const { addUploads } = useDocuments();
  const limits = getUploadLimits();
  const [picked, setPicked] = useState<Picked[]>([]);
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])].map((f) => ({ name: f.name, sizeBytes: f.size }));
    setPicked(files.map((f) => ({ ...f, error: checkFile(f) })));
    setFormError(undefined);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    if (picked.length === 0) return setFormError("دست‌کم یک فایل انتخاب کنید.");
    const valid = picked.filter((f) => !f.error);
    if (valid.length === 0) return setFormError("هیچ‌کدام از فایل‌های انتخاب‌شده قابل بارگذاری نیست.");
    setSubmitting(true);
    await simulateRequest(500);
    addUploads(valid.map(({ name, sizeBytes }) => ({ name, sizeBytes })));
    toast.success(`${formatNumber(valid.length)} سند بارگذاری شد.`);
    if (valid.length < picked.length) toast.error(`${formatNumber(picked.length - valid.length)} فایل رد شد.`);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field data-invalid={formError ? true : undefined}>
        <FieldLabel htmlFor="upload-files">فایل‌ها</FieldLabel>
        <Input
          id="upload-files"
          type="file"
          multiple
          accept={limits.extensions.map((e) => `.${e}`).join(",")}
          disabled={submitting}
          aria-invalid={formError ? true : undefined}
          onChange={handleChange}
        />
        <FieldDescription>
          فرمت‌های پذیرفته‌شده: {formatGroups.map((g) => g.label).join("، ")}. حداکثر حجم هر فایل {formatBytes(limits.maxBytes)}.
        </FieldDescription>
        <FieldError>{formError}</FieldError>
      </Field>
      {picked.length > 0 ? (
        <ul className="flex max-h-56 flex-col divide-y divide-border overflow-y-auto rounded-xl border border-border" aria-label="فایل‌های انتخاب‌شده">
          {picked.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex flex-col gap-0.5 p-3">
              <bdi dir="auto" className="break-all text-body-sm font-medium">{f.name}</bdi>
              <span className="text-caption text-muted-foreground">{formatBytes(f.sizeBytes)}</span>
              {f.error ? <span className="text-caption text-destructive" role="alert">{f.error}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
      <DialogFooter>
        <Button type="submit" loading={submitting}>بارگذاری</Button>
        <Button type="button" variant="outline" disabled={submitting} onClick={onClose}>انصراف</Button>
      </DialogFooter>
    </form>
  );
}

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function UploadDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>بارگذاری سند</DialogTitle>
          <DialogDescription>یک یا چند فایل انتخاب کنید.</DialogDescription>
        </DialogHeader>
        <UploadForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
