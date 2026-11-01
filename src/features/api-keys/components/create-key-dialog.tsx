"use client";

import { useMemo, useState } from "react";
import { SearchableSelect } from "@/components/shared/searchable-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAgents } from "@/features/agents/components/agents-provider";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { apiKeyKindLabels, type ApiKeyKind } from "@/lib/api-keys";
import { formatNumber } from "@/lib/format";
import { useApiKeys } from "./api-keys-provider";

const expiryOptions = [
  { value: "none", label: "بدون انقضا", days: null },
  { value: "30", label: "۳۰ روز", days: 30 },
  { value: "90", label: "۹۰ روز", days: 90 },
  { value: "365", label: "یک سال", days: 365 },
] as const;

type CreateKeyDialogProps = { open: boolean; onOpenChange: (open: boolean) => void; onCreated: (secret: string) => void };

/** Name, what the key opens (only what the user can already use), and when it expires. */
export function CreateKeyDialog({ open, onOpenChange, onCreated }: CreateKeyDialogProps) {
  const { allowed, createKey } = useApiKeys();
  const { models } = useModels();
  const { agents } = useAgents();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<ApiKeyKind>(allowed.kinds[0] ?? "model");
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<string>("90");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const resources = useMemo(() => {
    if (kind === "model") return models.filter((model) => model.isAvailable).map((model) => ({ value: model.id, label: model.name }));
    if (kind === "agent") return agents.filter((agent) => agent.isEnabled).map((agent) => ({ value: agent.id, label: agent.name }));
    return [{ value: "knowledge", label: "پایگاه دانش سازمان" }];
  }, [kind, models, agents]);

  const effectiveKind = allowed.kinds.includes(kind) ? kind : (allowed.kinds[0] ?? kind);
  const resourceValue = kind === "knowledge" ? "knowledge" : resourceId;

  async function submit() {
    const resource = resources.find((item) => item.value === resourceValue);
    if (!name.trim()) return setError("برای کلید یک نام بنویسید.");
    if (!resource) return setError(`یک ${apiKeyKindLabels[effectiveKind]} انتخاب کنید.`);
    setBusy(true);
    const result = await createKey({ name: name.trim(), kind: effectiveKind, resourceId: resource.value, resourceName: resource.label, expiresInDays: expiryOptions.find((item) => item.value === expiry)?.days ?? null });
    setBusy(false);
    if ("error" in result) return setError(result.error);
    setName("");
    setResourceId(null);
    setError(null);
    onOpenChange(false);
    onCreated(result.secret);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>کلید تازه</DialogTitle>
          <DialogDescription>کلید فقط به همان مدل یا عاملی که انتخاب می‌کنید دسترسی می‌دهد و بعد از ساخت فقط یک بار دیده می‌شود.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => { event.preventDefault(); void submit(); }} className="grid gap-4">
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="key-name">نام کلید</FieldLabel>
            <Input id="key-name" value={name} onChange={(event) => { setName(event.target.value); setError(null); }} placeholder="مثلاً ربات تلگرام فروش" aria-invalid={Boolean(error)} />
          </Field>
          <Field>
            <FieldLabel>برای چه چیزی؟</FieldLabel>
            <RadioGroup value={effectiveKind} onValueChange={(value) => { setKind(value as ApiKeyKind); setResourceId(null); setError(null); }} className="flex flex-wrap gap-4">
              {allowed.kinds.map((item) => (
                <div key={item} className="flex items-center gap-2"><RadioGroupItem id={`kind-${item}`} value={item} /><Label htmlFor={`kind-${item}`}>{apiKeyKindLabels[item]}</Label></div>
              ))}
            </RadioGroup>
          </Field>
          {effectiveKind !== "knowledge" ? (
            <Field>
              <FieldLabel htmlFor="key-resource">{effectiveKind === "model" ? "مدل" : "عامل"}</FieldLabel>
              <SearchableSelect id="key-resource" items={resources} value={resourceId} onValueChange={(value) => { setResourceId(value); setError(null); }} placeholder={effectiveKind === "model" ? "انتخاب مدل" : "انتخاب عامل"} searchPlaceholder="جست‌وجو" emptyText="موردی پیدا نشد" />
              <FieldDescription>فقط مواردی که خودتان به آن‌ها دسترسی دارید فهرست شده است.</FieldDescription>
            </Field>
          ) : null}
          <Field>
            <FieldLabel>انقضا</FieldLabel>
            <RadioGroup value={expiry} onValueChange={setExpiry} className="flex flex-wrap gap-4">
              {expiryOptions.map((item) => (
                <div key={item.value} className="flex items-center gap-2"><RadioGroupItem id={`exp-${item.value}`} value={item.value} /><Label htmlFor={`exp-${item.value}`}>{item.label}</Label></div>
              ))}
            </RadioGroup>
          </Field>
          <p className="text-body-sm text-muted-foreground">{allowed.monthlyTokenLimit === null ? "سقف مصرف ماهانه‌ی کلید تعیین نشده است." : `سقف مصرف ماهانه‌ی هر کلید ${formatNumber(allowed.monthlyTokenLimit)} توکن است.`}</p>
          {error ? <FieldError>{error}</FieldError> : null}
          <Button type="submit" className="w-fit" loading={busy}>ساخت کلید</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
