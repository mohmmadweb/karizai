"use client";

import { useState } from "react";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { isHttpAddress } from "@/admin/features/connections/lib/validation";
import { newSecret, webhookEvents, type Webhook, type WebhookEvent } from "../data/webhooks";

const events = Object.keys(webhookEvents) as WebhookEvent[];

type Props = { open: boolean; direction: Webhook["direction"]; onOpenChange: (open: boolean) => void; onCreate: (hook: Webhook) => void };

/** Creates an outgoing or incoming webhook; the secret is shown once, then only its last characters. */
export function WebhookDialog({ open, direction, onOpenChange, onCreate }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>{open ? <WebhookForm direction={direction} onClose={() => onOpenChange(false)} onCreate={onCreate} /> : null}</DialogContent>
    </Dialog>
  );
}

function WebhookForm({ direction, onClose, onCreate }: { direction: Webhook["direction"]; onClose: () => void; onCreate: Props["onCreate"] }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [picked, setPicked] = useState<WebhookEvent[]>(["run.finished"]);
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
  const [secret, setSecret] = useState<string | null>(null);
  const slug = name.trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || "new";

  function submit() {
    const found: typeof errors = {};
    if (!name.trim()) found.name = "نام را بنویسید.";
    if (direction === "out" && !isHttpAddress(url)) found.url = "نشانی باید با http یا https شروع شود.";
    setErrors(found);
    if (Object.keys(found).length) return;
    const s = newSecret();
    onCreate({ id: `wh-${Date.now()}`, direction, name: name.trim(), url: direction === "out" ? url.trim() : `https://kariz.parsapolymer.local/hooks/in/${slug}-${s.slice(-4)}`, events: direction === "out" ? picked : [], secretTail: s.slice(-4), active: true, target: direction === "in" ? "هنوز به جریانی وصل نشده" : undefined });
    setSecret(s);
  }

  if (secret) {
    return (
      <>
        <DialogHeader><DialogTitle>رمز امضا</DialogTitle><DialogDescription>این رمز فقط همین یک بار نشان داده می‌شود؛ آن را در سامانه‌ی مقصد ذخیره کنید.</DialogDescription></DialogHeader>
        <Alert variant="warning"><AlertDescription><bdi dir="ltr" className="break-all font-mono">{secret}</bdi></AlertDescription></Alert>
        <DialogFooter>
          <Button onClick={() => { void navigator.clipboard?.writeText(secret); toast.success("رونوشت شد."); }}><CopyIcon aria-hidden />رونوشت</Button>
          <Button variant="outline" onClick={onClose}>بستن</Button>
        </DialogFooter>
      </>
    );
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>{direction === "out" ? "وب‌هوک خروجی تازه" : "وب‌هوک ورودی تازه"}</DialogTitle>
        <DialogDescription>{direction === "out" ? "کاریز با هر رویداد انتخاب‌شده، یک درخواست امضاشده به این نشانی می‌فرستد." : "کاریز یک نشانی می‌سازد که سامانه‌ی دیگر رویدادهایش را به آن بفرستد."}</DialogDescription>
      </DialogHeader>
      <form noValidate onSubmit={(e) => { e.preventDefault(); submit(); }} className="grid gap-4">
        <Field data-invalid={errors.name ? true : undefined}>
          <FieldLabel htmlFor="wh-name">نام</FieldLabel>
          <Input id="wh-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(errors.name)} placeholder="مثلاً اعلان به واحد تدارکات" />
          {errors.name ? <FieldError>{errors.name}</FieldError> : null}
        </Field>
        {direction === "out" ? (
          <>
            <Field data-invalid={errors.url ? true : undefined}>
              <FieldLabel htmlFor="wh-url">نشانی مقصد</FieldLabel>
              <Input id="wh-url" dir="ltr" placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} aria-invalid={Boolean(errors.url)} />
              {errors.url ? <FieldError>{errors.url}</FieldError> : null}
            </Field>
            <fieldset className="grid gap-2 sm:grid-cols-2">
              <legend className="mb-2 text-label">رویدادها</legend>
              {events.map((ev) => (
                <label key={ev} className="flex items-center gap-2 text-body-sm">
                  <Checkbox checked={picked.includes(ev)} onCheckedChange={(c) => setPicked((l) => (c ? [...l, ev] : l.filter((x) => x !== ev)))} />
                  <span>{webhookEvents[ev]} <bdi dir="ltr" className="text-caption text-muted-foreground">{ev}</bdi></span>
                </label>
              ))}
            </fieldset>
          </>
        ) : null}
        <DialogFooter>
          <Button type="submit" disabled={direction === "out" && picked.length === 0}>ساخت</Button>
          <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
        </DialogFooter>
      </form>
    </>
  );
}
