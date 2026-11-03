"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ProjectNameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialName?: string;
  onSubmit: (name: string) => void;
};

/** Asks for a project name; used to create a project and to rename one. */
export function ProjectNameDialog({ open, onOpenChange, title, initialName = "", onSubmit }: ProjectNameDialogProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!name.trim()) {
      setError("نام پروژه نمی‌تواند خالی باشد.");
      return;
    }
    onSubmit(name.trim());
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (next) { setName(initialName); setError(null); } onOpenChange(next); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>گفتگوهای مرتبط را زیر یک پروژه کنار هم نگه دارید.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="grid gap-4">
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="chat-project-name">نام پروژه</FieldLabel>
            <Input id="chat-project-name" value={name} onChange={(event) => { setName(event.target.value); setError(null); }} aria-invalid={Boolean(error)} autoFocus />
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
            <Button type="submit">ذخیره</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
