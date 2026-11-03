"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; existing: string[]; onCreate: (name: string) => void };

/** «پوشه جدید»: the folder lives only until the page is reloaded. */
export function NewFolderDialog({ open, onOpenChange, existing, onCreate }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  function submit() {
    const value = name.trim();
    if (!value) return setError("نام پوشه را بنویسید.");
    if (existing.includes(value)) return setError("پوشه‌ای با این نام هست. نام دیگری بنویسید.");
    onCreate(value);
    setName("");
    setError(null);
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>پوشه جدید</DialogTitle>
          <DialogDescription>پوشه تا بستن یا تازه‌کردن صفحه نگه داشته می‌شود.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex flex-col gap-4">
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="folder-name">نام پوشه</FieldLabel>
            <Input id="folder-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="مثلاً پوشه‌ی آزمون‌ها" aria-invalid={Boolean(error)} />
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>
          <DialogFooter><Button type="submit">ساخت پوشه</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
