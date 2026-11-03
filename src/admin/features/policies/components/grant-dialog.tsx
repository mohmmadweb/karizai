"use client";

import { useState, type FormEvent } from "react";
import type { Permission, PermissionGrant } from "@/lib/policy-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const kindLabels: Record<PermissionGrant["resourceKind"], string> = {
  connection: "اتصال",
  data: "داده",
  knowledge: "دانش",
  agent: "عامل",
};
export const permissionItems: { value: Permission; label: string }[] = [
  { value: "read", label: "خواندن" },
  { value: "read-write", label: "خواندن‌ونوشتن" },
];
const kindItems = (Object.keys(kindLabels) as PermissionGrant["resourceKind"][]).map((value) => ({ value, label: kindLabels[value] }));

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: { value: string; label: string }[];
  onSave: (grant: Omit<PermissionGrant, "id">) => void;
};

function Picker<T extends string>({ id, label, items, value, onChange, placeholder }: { id: string; label: string; items: { value: T; label: string }[]; value: T | null; onChange: (v: T) => void; placeholder?: string }) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select items={items} value={value} onValueChange={(v) => v && onChange(v as T)}>
        <SelectTrigger id={id} className="w-full"><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent><SelectGroup>{items.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
      </Select>
    </Field>
  );
}

/** New grant: a group, a resource and the kind of permission. */
export function GrantDialog({ open, onOpenChange, groups, onSave }: Props) {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [resource, setResource] = useState("");
  const [kind, setKind] = useState<PermissionGrant["resourceKind"]>("connection");
  const [permission, setPermission] = useState<Permission>("read");
  const [error, setError] = useState<string>();

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!groupId || !resource.trim()) return setError("گروه و منبع را مشخص کنید.");
    onSave({ groupId, groupName: groups.find((g) => g.value === groupId)?.label ?? "", resource: resource.trim(), resourceKind: kind, permission });
    setGroupId(null);
    setResource("");
    setError(undefined);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>مجوز تازه</DialogTitle>
          <DialogDescription>«خواندن» فقط دیدن و پرسیدن است؛ «خواندن‌ونوشتن» ثبت و تغییر هم دارد.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="flex flex-col gap-6">
          <Picker id="grant-group" label="گروه" items={groups} value={groupId} onChange={setGroupId} placeholder="یک گروه انتخاب کنید" />
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="grant-resource">منبع</FieldLabel>
            <Input id="grant-resource" value={resource} placeholder="مثلاً راهکاران: سفارش خرید" onChange={(e) => setResource(e.target.value)} />
            <FieldError>{error}</FieldError>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Picker id="grant-kind" label="نوع منبع" items={kindItems} value={kind} onChange={setKind} />
            <Picker id="grant-permission" label="مجوز" items={permissionItems} value={permission} onChange={setPermission} />
          </div>
          <DialogFooter>
            <Button type="submit">افزودن مجوز</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
