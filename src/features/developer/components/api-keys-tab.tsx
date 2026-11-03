"use client";

import { useState } from "react";
import { KeyRoundIcon, PlusIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAgents } from "@/features/agents/components/agents-provider";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { getCurrentUser } from "@/features/user-session/data/session";
import { apiKeyKindLabels, apiKeyStatus, apiKeyStatusLabels, type ApiKeyKind, type ApiKeyRecord } from "@/lib/api-keys";
import { formatDate, formatNumber } from "@/lib/format";
import { simulateRequest } from "@/lib/simulate-request";
import { myKeyPolicy } from "../data/api-keys";
import { CodeBlock } from "./code-block";

const statusVariant = { active: "success", expired: "warning", revoked: "destructive" } as const;
const expiryOptions = [{ value: "30", label: "۳۰ روز" }, { value: "90", label: "۹۰ روز" }, { value: "365", label: "یک سال" }, { value: "none", label: "بدون انقضا" }];

function PlainSelect({ id, items, value, onChange }: { id: string; items: { value: string; label: string }[]; value: string; onChange: (value: string) => void }) {
  return (
    <Select items={items} value={value || null} onValueChange={(next) => next && onChange(String(next))}>
      <SelectTrigger id={id}><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
      <SelectContent><SelectGroup>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
    </Select>
  );
}

function randomKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  return `kz_live_${Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")}`;
}

/** Personal API keys: create one for a model, an Agent or the knowledge base, see it once, revoke it. */
export function ApiKeysTab({ keys, onKeysChange }: { keys: ApiKeyRecord[]; onKeysChange: (keys: ApiKeyRecord[]) => void }) {
  const { models } = useModels();
  const { agents } = useAgents();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<ApiKeyKind>("agent");
  const [resource, setResource] = useState("");
  const [expiry, setExpiry] = useState("90");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [shown, setShown] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<ApiKeyRecord | null>(null);

  const resources: Record<ApiKeyKind, { value: string; label: string }[]> = {
    model: models.filter((m) => m.isAvailable).map((m) => ({ value: m.id, label: `${m.name}${m.isInternal ? " (داخلی)" : ""}` })),
    agent: agents.filter((a) => a.isEnabled).map((a) => ({ value: a.id, label: a.name })),
    knowledge: [{ value: "knowledge", label: "دانش سازمانی" }],
  };

  async function create() {
    const target = resources[kind].find((item) => item.value === resource);
    if (!name.trim() || !target) {
      setError(!name.trim() ? "یک نام برای شناختن کلید بنویسید." : "مشخص کنید کلید برای کدام مورد است.");
      return;
    }
    setBusy(true);
    await simulateRequest(600);
    const key = randomKey();
    const user = getCurrentUser();
    const now = new Date();
    const record: ApiKeyRecord = {
      id: `key-new-${keys.length + 1}`, name: name.trim(), ownerId: user.id, ownerName: user.name, kind, resourceId: target.value, resourceName: target.label,
      last4: key.slice(-4), createdAt: now.toISOString(), expiresAt: expiry === "none" ? null : new Date(now.getTime() + Number(expiry) * 864e5).toISOString(), lastUsedAt: null, revokedAt: null,
    };
    onKeysChange([record, ...keys]);
    setBusy(false);
    setOpen(false);
    setShown(key);
    setName("");
    setResource("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-reading text-body-sm text-muted-foreground">
          کلید فقط به چیزهایی دسترسی دارد که خود شما دارید. ادمین برای گروه شما {myKeyPolicy.kinds.map((item) => apiKeyKindLabels[item]).join("، ")} را مجاز کرده است{myKeyPolicy.monthlyTokenLimit ? ` و سقف ماهانه‌ی هر کلید ${formatNumber(myKeyPolicy.monthlyTokenLimit)} توکن است` : ""}.
        </p>
        <Button onClick={() => { setError(null); setOpen(true); }}><PlusIcon aria-hidden />ساخت کلید</Button>
      </div>
      {shown ? (
        <Alert variant="warning">
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>کلید تازه را همین حالا کپی کنید</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <span>این کلید فقط همین یک بار نمایش داده می‌شود و بعد فقط چهار حرف آخرش دیده می‌شود.</span>
            <CodeBlock code={shown} label="کلید" />
            <Button size="sm" variant="outline" className="w-fit" onClick={() => setShown(null)}>کپی کردم</Button>
          </AlertDescription>
        </Alert>
      ) : null}
      <ul className="flex flex-col divide-y rounded-xl border">
        {keys.map((key) => {
          const status = apiKeyStatus(key);
          return (
            <li key={key.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-2 text-label"><KeyRoundIcon className="size-4 text-muted-foreground" aria-hidden />{key.name}<Badge variant={statusVariant[status]}>{apiKeyStatusLabels[status]}</Badge></span>
                <span className="text-body-sm text-muted-foreground">
                  {apiKeyKindLabels[key.kind]}: {key.resourceName} · <bdi dir="ltr" className="font-mono">kz_live_…{key.last4}</bdi> · ساخت {formatDate(key.createdAt)}{key.expiresAt ? ` · انقضا ${formatDate(key.expiresAt)}` : " · بدون انقضا"}{key.lastUsedAt ? ` · آخرین استفاده ${formatDate(key.lastUsedAt)}` : ""}
                </span>
              </div>
              {status === "active" ? <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setRevoking(key)}>ابطال</Button> : null}
            </li>
          );
        })}
      </ul>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ساخت کلید API</DialogTitle>
            <DialogDescription>کلید برای یک مدل، یک عامل یا پایگاه دانش ساخته می‌شود.</DialogDescription>
          </DialogHeader>
          <form noValidate className="grid gap-4" onSubmit={(event) => { event.preventDefault(); void create(); }}>
            <Field data-invalid={error && !name.trim() ? true : undefined}>
              <FieldLabel htmlFor="key-name">نام کلید</FieldLabel>
              <Input id="key-name" value={name} placeholder="مثلاً: اسکریپت گزارش شیفت" onChange={(event) => { setName(event.target.value); setError(null); }} />
            </Field>
            <Field>
              <FieldLabel htmlFor="key-kind">نوع</FieldLabel>
              <PlainSelect id="key-kind" items={myKeyPolicy.kinds.map((item) => ({ value: item, label: apiKeyKindLabels[item] }))} value={kind} onChange={(value) => { setKind(value as ApiKeyKind); setResource(""); }} />
            </Field>
            <Field data-invalid={error && name.trim() ? true : undefined}>
              <FieldLabel htmlFor="key-resource">{apiKeyKindLabels[kind]}</FieldLabel>
              <PlainSelect id="key-resource" items={resources[kind]} value={resource} onChange={(value) => { setResource(value); setError(null); }} />
              {error ? <FieldError>{error}</FieldError> : <FieldDescription>فقط مواردی که خودتان به آن‌ها دسترسی دارید.</FieldDescription>}
            </Field>
            <Field>
              <FieldLabel htmlFor="key-expiry">انقضا</FieldLabel>
              <PlainSelect id="key-expiry" items={expiryOptions} value={expiry} onChange={setExpiry} />
            </Field>
            <DialogFooter>
              <Button type="submit" loading={busy}>ساخت کلید</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>انصراف</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={revoking !== null} onOpenChange={(value) => !value && setRevoking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ابطال «{revoking?.name}»؟</AlertDialogTitle>
            <AlertDialogDescription>برنامه‌هایی که از این کلید استفاده می‌کنند از همین لحظه خطای ۴۰۱ می‌گیرند. این کار برگشت‌پذیر نیست.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => { if (revoking) { onKeysChange(keys.map((item) => (item.id === revoking.id ? { ...item, revokedAt: new Date().toISOString() } : item))); toast.success(`کلید «${revoking.name}» باطل شد.`); } setRevoking(null); }}>ابطال کلید</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

