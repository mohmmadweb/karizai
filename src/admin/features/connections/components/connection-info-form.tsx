"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PasswordField } from "@/components/shared/password-field";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { connectionAuthLabels, connectionTypeLabels, type ConnectionAuth, type ConnectionType, type DefinedConnection } from "@/lib/connections";
import { endpointError, isValidEndpoint } from "../lib/validation";
import { useConnections } from "./connections-provider";

const typeItems = (Object.keys(connectionTypeLabels) as ConnectionType[]).map((value) => ({ value, label: connectionTypeLabels[value] }));
const authItems = (Object.keys(connectionAuthLabels) as ConnectionAuth[]).map((value) => ({ value, label: connectionAuthLabels[value] }));

/** Name, address, and how the system is signed in to. The key goes to the server and is never shown again. */
export function ConnectionInfoForm({ connection }: { connection: DefinedConnection }) {
  const { connections, updateConnection } = useConnections();
  const [values, setValues] = useState({ name: connection.name, domain: connection.domain, description: connection.description, endpoint: connection.endpoint });
  const [errors, setErrors] = useState<{ name?: string; endpoint?: string }>({});
  const [key, setKey] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const set = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const dirty = (Object.keys(values) as (keyof typeof values)[]).some((field) => values[field] !== connection[field]);

  function save() {
    const found: typeof errors = {};
    if (!values.name.trim()) found.name = "نام اتصال را بنویسید.";
    else if (connections.some((item) => item.id !== connection.id && item.name.trim() === values.name.trim())) found.name = "اتصالی با این نام وجود دارد.";
    if (!isValidEndpoint(connection.type, values.endpoint)) found.endpoint = endpointError(connection.type);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    updateConnection(connection.id, { name: values.name.trim(), domain: values.domain.trim(), description: values.description.trim(), endpoint: values.endpoint.trim() });
    toast.success("اطلاعات ذخیره شد.");
  }

  async function saveKey() {
    setSavingKey(true);
    try {
      const response = await fetch(`/api/admin/connections/${connection.id}/key`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ apiKey: key }) });
      if (!response.ok) throw new Error();
      setKey("");
      toast.success("کلید ذخیره شد.");
    } catch {
      toast.error("کلید ذخیره نشد. دوباره تلاش کنید.");
    } finally {
      setSavingKey(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor="c-name">نام</FieldLabel>
        <Input id="c-name" value={values.name} onChange={(event) => set("name", event.target.value)} aria-invalid={Boolean(errors.name)} />
        {errors.name ? <FieldError>{errors.name}</FieldError> : null}
      </Field>
      <Field>
        <FieldLabel htmlFor="c-domain">حوزه</FieldLabel>
        <Input id="c-domain" value={values.domain} onChange={(event) => set("domain", event.target.value)} />
      </Field>
      <Field>
        <FieldLabel htmlFor="c-type">نوع</FieldLabel>
        <Select items={typeItems} value={connection.type} onValueChange={(value) => value && updateConnection(connection.id, { type: value as ConnectionType })}>
          <SelectTrigger id="c-type" className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{typeItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </Field>
      <Field data-invalid={errors.endpoint ? true : undefined}>
        <FieldLabel htmlFor="c-endpoint">نشانی سیستم</FieldLabel>
        <Input id="c-endpoint" dir="ltr" value={values.endpoint} onChange={(event) => set("endpoint", event.target.value)} aria-invalid={Boolean(errors.endpoint)} />
        {errors.endpoint ? <FieldError>{errors.endpoint}</FieldError> : null}
      </Field>
      <Field className="md:col-span-2">
        <FieldLabel htmlFor="c-description">توضیح برای کاربران</FieldLabel>
        <Textarea id="c-description" rows={2} value={values.description} onChange={(event) => set("description", event.target.value)} />
      </Field>
      <Field>
        <FieldLabel htmlFor="c-auth">احراز هویت</FieldLabel>
        <Select items={authItems} value={connection.auth} onValueChange={(value) => value && updateConnection(connection.id, { auth: value as ConnectionAuth })}>
          <SelectTrigger id="c-auth" className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{authItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
        {connection.auth === "user-login" ? <FieldDescription>هر کاربر پیش از استفاده، با حساب خودش وارد می‌شود.</FieldDescription> : null}
      </Field>
      {connection.auth === "shared-key" ? (
        <Field>
          <FieldLabel htmlFor="c-key">کلید دسترسی</FieldLabel>
          <div className="flex gap-2">
            <PasswordField id="c-key" autoComplete="off" value={key} onChange={(event) => setKey(event.target.value)} />
            <Button type="button" variant="outline" disabled={!key.trim()} loading={savingKey} onClick={() => void saveKey()}>ذخیره‌ی کلید</Button>
          </div>
          <FieldDescription>کلید فقط روی سرور و رمزنگاری‌شده می‌ماند و دوباره نشان داده نمی‌شود.</FieldDescription>
        </Field>
      ) : null}
      <div className="md:col-span-2"><Button type="button" disabled={!dirty} onClick={save}>ذخیره‌ی اطلاعات</Button></div>
    </div>
  );
}
