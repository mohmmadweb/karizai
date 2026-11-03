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
import { useModels } from "../../hooks/use-models";
import {
  validateApiKey,
  validateBaseUrl,
  validateProviderName,
} from "../../lib/validation";
import type { ModelProvider } from "../../types";
import {
  ProviderFields,
  type ProviderFieldErrors,
  type ProviderFieldValues,
} from "./provider-fields";

/** Sends the key to the server, which keeps it encrypted. The key is not stored in the browser. */
async function saveKey(providerId: string, apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/providers/${providerId}/key`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    });
    if (response.ok) return true;
  } catch {
    // falls through to the message below
  }
  toast.error("کلید ذخیره نشد. دوباره تلاش کنید.");
  return false;
}

function ProviderForm({
  provider,
  onClose,
}: {
  provider?: ModelProvider;
  onClose: () => void;
}) {
  const { addProvider, updateProvider, fetchModels } = useModels();
  const editing = Boolean(provider);
  const [values, setValues] = useState<ProviderFieldValues>({
    name: provider?.name ?? "",
    baseUrl: provider?.baseUrl ?? "",
    apiKey: "",
  });
  const [errors, setErrors] = useState<ProviderFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const next: ProviderFieldErrors = {
      name: validateProviderName(values.name),
      baseUrl: validateBaseUrl(values.baseUrl),
      apiKey: editing ? undefined : validateApiKey(values.apiKey),
    };
    setErrors(next);
    if (next.name || next.baseUrl || next.apiKey) return;
    setSubmitting(true);
    const baseUrl = values.baseUrl.trim();
    if (provider) {
      const result = updateProvider(provider.id, values);
      setSubmitting(false);
      if (!result.ok) {
        setErrors({ name: result.error });
        return;
      }
      if (values.apiKey.trim() && !(await saveKey(provider.id, values.apiKey))) return;
      toast.success("ارائه‌دهنده به‌روز شد.");
      if (baseUrl !== provider.baseUrl || values.apiKey.trim()) void fetchModels(provider.id, baseUrl);
    } else {
      const result = addProvider(values);
      setSubmitting(false);
      if (!result.ok) {
        setErrors({ name: result.error });
        return;
      }
      if (!(await saveKey(result.id, values.apiKey))) return;
      toast.success("ارائه‌دهنده ثبت شد.");
      void fetchModels(result.id, baseUrl);
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <ProviderFields
          idPrefix={editing ? "edit-provider" : "add-provider"}
          values={values}
          errors={errors}
          disabled={submitting}
          keyOptional={editing}
          onChange={setValues}
          onErrors={setErrors}
        />
      </FieldGroup>
      <DialogFooter>
        <Button type="submit" loading={submitting}>
          {editing ? "ذخیره" : "ثبت"}
        </Button>
        <Button type="button" variant="outline" disabled={submitting} onClick={onClose}>
          انصراف
        </Button>
      </DialogFooter>
    </form>
  );
}

type ProviderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When given, the dialog edits this provider instead of registering a new one. */
  provider?: ModelProvider;
};

export function ProviderDialog({ open, onOpenChange, provider }: ProviderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{provider ? "ویرایش ارائه‌دهنده" : "ثبت ارائه‌دهنده"}</DialogTitle>
          <DialogDescription>
            {provider
              ? "نام و نشانی را عوض کنید. کلید فعلی تا وقتی کلید تازه ننویسید می‌ماند."
              : "نام، نشانی پایه و کلید دسترسی ارائه‌دهنده را وارد کنید."}
          </DialogDescription>
        </DialogHeader>
        <ProviderForm key={provider?.id ?? "new"} provider={provider} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
