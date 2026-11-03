"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { connectionTypeLabels, type ConnectionType } from "@/lib/connections";
import { isHttpAddress } from "../lib/validation";
import { useConnections } from "./connections-provider";

const typeItems = (Object.keys(connectionTypeLabels) as ConnectionType[]).map((value) => ({ value, label: connectionTypeLabels[value] }));

type ConnectionDialogProps = { open: boolean; onOpenChange: (open: boolean) => void };

/** Creates an inactive connection; tools, access, and the key are set on its own page. */
export function ConnectionDialog({ open, onOpenChange }: ConnectionDialogProps) {
  const router = useRouter();
  const { connections, addConnection } = useConnections();
  const [values, setValues] = useState({ name: "", domain: "", endpoint: "" });
  const [type, setType] = useState<ConnectionType>("api");
  const [errors, setErrors] = useState<{ name?: string; endpoint?: string }>({});
  const set = (key: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function submit() {
    const found: typeof errors = {};
    if (!values.name.trim()) found.name = "نام اتصال را بنویسید.";
    else if (connections.some((item) => item.name.trim() === values.name.trim())) found.name = "اتصالی با این نام وجود دارد.";
    if (!isHttpAddress(values.endpoint)) found.endpoint = "نشانی باید با http یا https شروع شود.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const id = addConnection({ ...values, type });
    toast.success("اتصال ساخته شد؛ ابزارها و دسترسی را تعیین کنید.");
    setValues({ name: "", domain: "", endpoint: "" });
    onOpenChange(false);
    router.push(`/admin/connections/${id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>اتصال تازه</DialogTitle>
          <DialogDescription>اتصال تا وقتی ابزار و دسترسی نداشته باشد و فعال نشود، برای کاربران دیده نمی‌شود.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={(event) => { event.preventDefault(); submit(); }} className="grid gap-4">
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor="conn-name">نام</FieldLabel>
            <Input id="conn-name" value={values.name} onChange={(event) => set("name", event.target.value)} aria-invalid={Boolean(errors.name)} placeholder="مثلاً دیدار" />
            {errors.name ? <FieldError>{errors.name}</FieldError> : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="conn-domain">حوزه</FieldLabel>
            <Input id="conn-domain" value={values.domain} onChange={(event) => set("domain", event.target.value)} placeholder="مثلاً مدیریت ارتباط با مشتری CRM" />
          </Field>
          <Field>
            <FieldLabel htmlFor="conn-type">نوع</FieldLabel>
            <Select items={typeItems} value={type} onValueChange={(value) => value && setType(value as ConnectionType)}>
              <SelectTrigger id="conn-type" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{typeItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </Field>
          <Field data-invalid={errors.endpoint ? true : undefined}>
            <FieldLabel htmlFor="conn-endpoint">نشانی سیستم</FieldLabel>
            <Input id="conn-endpoint" dir="ltr" placeholder="https://" value={values.endpoint} onChange={(event) => set("endpoint", event.target.value)} aria-invalid={Boolean(errors.endpoint)} />
            {errors.endpoint ? <FieldError>{errors.endpoint}</FieldError> : null}
          </Field>
          <DialogFooter>
            <Button type="submit">ساخت</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
