"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { connectionEndpointHints, connectionTypeLabels, type ConnectionType } from "@/lib/connections";
import { formatNumber } from "@/admin/lib/format";
import { getCatalogEntry } from "../data/connection-catalog";
import { getConnectionTemplates, type ConnectionTemplate } from "../data/templates";
import { endpointError, isValidEndpoint } from "../lib/validation";
import { useConnections } from "./connections-provider";

const typeItems = (Object.keys(connectionTypeLabels) as ConnectionType[]).map((value) => ({ value, label: connectionTypeLabels[value] }));
const templates = getConnectionTemplates();
const templateItems = [{ value: "none", label: "بدون قالب" }, ...templates.map((t) => ({ value: t.id, label: t.label }))];

type ConnectionDialogProps = { open: boolean; onOpenChange: (open: boolean) => void };

/** Creates an inactive connection; tools, access, and the key are set on its own page. A template fills the fields and the tools. */
export function ConnectionDialog({ open, onOpenChange }: ConnectionDialogProps) {
  const router = useRouter();
  const { connections, addConnection } = useConnections();
  const [values, setValues] = useState({ name: "", domain: "", endpoint: "" });
  const [type, setType] = useState<ConnectionType>("api");
  const [template, setTemplate] = useState<ConnectionTemplate | null>(null);
  const [errors, setErrors] = useState<{ name?: string; endpoint?: string }>({});
  const set = (key: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function chooseTemplate(id: string) {
    const found = templates.find((t) => t.id === id) ?? null;
    setTemplate(found);
    setErrors({});
    if (found) {
      setValues({ name: found.name, domain: found.domain, endpoint: found.endpoint });
      setType(found.type);
    }
  }

  function submit() {
    const found: typeof errors = {};
    if (!values.name.trim()) found.name = "نام اتصال را بنویسید.";
    else if (connections.some((item) => item.name.trim() === values.name.trim())) found.name = "اتصالی با این نام وجود دارد.";
    if (!isValidEndpoint(type, values.endpoint)) found.endpoint = endpointError(type);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    // Without a template, GitLab, Mattermost and Confluence still come with their ready domain and tools.
    const ready = template ? null : getCatalogEntry(type);
    const tools = template?.tools ?? ready?.tools.map((tool, index) => ({ ...tool, id: `ready-${index + 1}` }));
    const id = addConnection({ ...values, domain: values.domain.trim() || ready?.domain || "", type, description: template?.description, tools });
    toast.success(template ? "اتصال با ابزارهای قالب ساخته شد؛ دسترسی را تعیین کنید." : "اتصال ساخته شد؛ ابزارها و دسترسی را تعیین کنید.");
    setValues({ name: "", domain: "", endpoint: "" });
    setTemplate(null);
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
          <Field>
            <FieldLabel htmlFor="conn-template">قالب آماده</FieldLabel>
            <Select items={templateItems} value={template?.id ?? "none"} onValueChange={(value) => value && chooseTemplate(value)}>
              <SelectTrigger id="conn-template" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{templateItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
            {template ? (
              <FieldDescription className="flex flex-wrap items-center gap-2">
                <Badge variant="info">{formatNumber(template.tools.length)} ابزار آماده</Badge>
                {template.hint}
              </FieldDescription>
            ) : <FieldDescription>برای ERP راهکاران یا SCADA خط تولید، قالب نشانی و ابزارها را پر می‌کند.</FieldDescription>}
          </Field>
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
            <Select items={typeItems} value={type} onValueChange={(value) => { if (value) { setType(value as ConnectionType); setErrors((e) => ({ ...e, endpoint: undefined })); } }}>
              <SelectTrigger id="conn-type" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{typeItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </Field>
          <Field data-invalid={errors.endpoint ? true : undefined}>
            <FieldLabel htmlFor="conn-endpoint">نشانی سیستم</FieldLabel>
            <Input id="conn-endpoint" dir="ltr" placeholder={connectionEndpointHints[type]} value={values.endpoint} onChange={(event) => set("endpoint", event.target.value)} aria-invalid={Boolean(errors.endpoint)} />
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
