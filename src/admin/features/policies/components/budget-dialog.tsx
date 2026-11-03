"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNumber } from "@/admin/lib/format";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Editing one group; when absent the admin picks a group from `groups`. */
  groupName?: string;
  groups?: { value: string; label: string }[];
  initialToman?: number;
  onSave: (groupId: string | null, weeklyToman: number) => void;
};

const toLatin = (text: string) => text.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٬,\s]/g, "");

/** Weekly toman budget of one group. */
export function BudgetDialog({ open, onOpenChange, groupName, groups = [], initialToman, onSave }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{groupName ? `بودجه‌ی هفتگی گروه ${groupName}` : "بودجه‌ی تازه"}</DialogTitle>
          <DialogDescription>مصرف مدل‌های این گروه به تومان حساب می‌شود و هر شنبه از صفر شروع می‌شود.</DialogDescription>
        </DialogHeader>
        {open ? <Form key={groupName ?? "new"} {...{ groupName, groups, initialToman, onSave }} onCancel={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function Form({ groupName, groups, initialToman, onSave, onCancel }: Omit<Props, "open" | "onOpenChange"> & { groups: { value: string; label: string }[]; onCancel: () => void }) {
  const [amount, setAmount] = useState(initialToman ? String(initialToman) : "");
  const [groupId, setGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const value = Number(toLatin(amount));

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!groupName && !groupId) return setError("یک گروه انتخاب کنید.");
    if (!Number.isFinite(value) || value < 100_000) return setError("مبلغ را به تومان و دست‌کم ۱۰۰٬۰۰۰ بنویسید.");
    onSave(groupName ? null : groupId, value);
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      {groupName ? null : (
        <Field>
          <FieldLabel htmlFor="budget-group">گروه</FieldLabel>
          <Select items={groups} value={groupId} onValueChange={setGroupId}>
            <SelectTrigger id="budget-group" className="w-full"><SelectValue placeholder="یک گروه انتخاب کنید" /></SelectTrigger>
            <SelectContent><SelectGroup>{groups.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectGroup></SelectContent>
          </Select>
        </Field>
      )}
      <Field data-invalid={error ? true : undefined}>
        <FieldLabel htmlFor="budget-amount">بودجه‌ی هفتگی (تومان)</FieldLabel>
        <Input id="budget-amount" inputMode="numeric" dir="ltr" className="text-start" value={amount} aria-invalid={Boolean(error)} onChange={(e) => setAmount(e.target.value)} />
        {value > 0 ? <FieldDescription>{formatNumber(value)} تومان در هفته</FieldDescription> : null}
        <FieldError>{error}</FieldError>
      </Field>
      <DialogFooter>
        <Button type="submit">ذخیره‌ی بودجه</Button>
        <Button type="button" variant="outline" onClick={onCancel}>انصراف</Button>
      </DialogFooter>
    </form>
  );
}
