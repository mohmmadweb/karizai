"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { parseAmount } from "@/admin/features/budgets/lib/forecast";
import { limitKeys, limitLabels, type Limits } from "../data/limits";

type Target = { id: string; name: string; limits: Limits };
type Props = { target: Target | null; onOpenChange: (open: boolean) => void; onSave: (id: string, limits: Limits) => void };

export function LimitsDialog({ target, onOpenChange, onSave }: Props) {
  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent>{target ? <LimitsForm key={target.id} target={target} onClose={() => onOpenChange(false)} onSave={onSave} /> : null}</DialogContent>
    </Dialog>
  );
}

function LimitsForm({ target, onClose, onSave }: { target: Target; onClose: () => void; onSave: Props["onSave"] }) {
  const [values, setValues] = useState(() => Object.fromEntries(limitKeys.map((k) => [k, String(target.limits[k])])) as Record<keyof Limits, string>);
  const [invalid, setInvalid] = useState<string[]>([]);
  function submit() {
    const bad = limitKeys.filter((k) => !(parseAmount(values[k]) ?? 0));
    setInvalid(bad);
    if (bad.length > 0) return;
    onSave(target.id, Object.fromEntries(limitKeys.map((k) => [k, parseAmount(values[k])!])) as Limits);
    onClose();
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>محدودیت نرخ {target.name}</DialogTitle>
        <DialogDescription>درخواست‌های بیش از حد در صف می‌مانند یا به مدل داخلی می‌روند؛ تغییر همان لحظه اعمال می‌شود.</DialogDescription>
      </DialogHeader>
      <form noValidate onSubmit={(event) => { event.preventDefault(); submit(); }} className="grid gap-4 sm:grid-cols-2">
        {limitKeys.map((k) => (
          <Field key={k} data-invalid={invalid.includes(k) ? true : undefined}>
            <FieldLabel htmlFor={`lim-${k}`}>{limitLabels[k]}</FieldLabel>
            <Input id={`lim-${k}`} dir="ltr" inputMode="numeric" value={values[k]} aria-invalid={invalid.includes(k)} onChange={(event) => setValues((v) => ({ ...v, [k]: event.target.value }))} />
            {invalid.includes(k) ? <FieldError>یک عدد بزرگ‌تر از صفر بنویسید.</FieldError> : null}
          </Field>
        ))}
        <DialogFooter className="sm:col-span-2">
          <Button type="submit">ذخیره</Button>
          <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
        </DialogFooter>
      </form>
    </>
  );
}
