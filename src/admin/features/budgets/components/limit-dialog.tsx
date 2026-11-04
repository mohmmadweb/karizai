"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { parseAmount, toman } from "../lib/forecast";
import type { UserLimit } from "../data/user-limits";

type Props = { user: UserLimit | null; onOpenChange: (open: boolean) => void; onSave: (id: string, monthlyToman: number) => void };

/** Edits one person's monthly limit in toman. */
export function LimitDialog({ user, onOpenChange, onSave }: Props) {
  return (
    <Dialog open={user !== null} onOpenChange={onOpenChange}>
      <DialogContent>{user ? <LimitForm key={user.id} user={user} onClose={() => onOpenChange(false)} onSave={onSave} /> : null}</DialogContent>
    </Dialog>
  );
}

function LimitForm({ user, onClose, onSave }: { user: UserLimit; onClose: () => void; onSave: Props["onSave"] }) {
  const [text, setText] = useState(String(user.monthlyToman));
  const [error, setError] = useState<string | null>(null);
  const amount = parseAmount(text);
  function submit() {
    if (amount === null || amount < 10_000) return setError("مبلغی دست‌کم ۱۰٬۰۰۰ تومان با رقم بنویسید.");
    onSave(user.id, amount);
    onClose();
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>سقف ماهانه‌ی {user.name}</DialogTitle>
        <DialogDescription>وقتی سقف تمام شود، رفتاری که برای گروه او در «سیاست‌ها» تعیین شده اجرا می‌شود.</DialogDescription>
      </DialogHeader>
      <form noValidate onSubmit={(event) => { event.preventDefault(); submit(); }} className="grid gap-4">
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="limit-amount">سقف ماهانه (تومان)</FieldLabel>
          <Input id="limit-amount" inputMode="numeric" dir="ltr" value={text} onChange={(event) => { setText(event.target.value); setError(null); }} aria-invalid={Boolean(error)} />
          {error ? <FieldError>{error}</FieldError> : <FieldDescription>{amount !== null ? toman(amount) : "فقط رقم"}</FieldDescription>}
        </Field>
        <DialogFooter>
          <Button type="submit">ذخیره</Button>
          <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
        </DialogFooter>
      </form>
    </>
  );
}
