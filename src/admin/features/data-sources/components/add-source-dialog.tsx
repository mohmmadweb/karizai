"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { simulateRequest } from "@/lib/simulate-request";
import { useDataSources } from "../hooks/use-data-sources";
import {
  emptyForm,
  hasErrors,
  toInput,
  validateForm,
  type SourceFormErrors,
  type SourceFormValues,
} from "../lib/source-form";
import { SourceFields } from "./source-fields";

function AddSourceForm({ onClose }: { onClose: () => void }) {
  const { addSource } = useDataSources();
  const [values, setValues] = useState<SourceFormValues>(emptyForm);
  const [errors, setErrors] = useState<SourceFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const next = validateForm(values, true);
    setErrors(next);
    if (hasErrors(next)) return;
    setSubmitting(true);
    await simulateRequest();
    const result = addSource(toInput(values));
    setSubmitting(false);
    if (!result.ok) {
      setErrors({ name: result.error });
      return;
    }
    toast.success("اتصال افزوده شد.");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup className="max-h-[60vh] overflow-y-auto pe-1">
        <SourceFields
          idPrefix="add-source"
          values={values}
          errors={errors}
          disabled={submitting}
          onChange={setValues}
          onErrors={setErrors}
        />
      </FieldGroup>
      <DialogFooter>
        <Button type="submit" loading={submitting}>
          افزودن
        </Button>
        <Button type="button" variant="outline" disabled={submitting} onClick={onClose}>
          انصراف
        </Button>
      </DialogFooter>
    </form>
  );
}

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function AddSourceDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن اتصال</DialogTitle>
          <DialogDescription>
            اطلاعات انبار داده را با یک حساب فقط‌خواندنی وارد کنید.
          </DialogDescription>
        </DialogHeader>
        <AddSourceForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
