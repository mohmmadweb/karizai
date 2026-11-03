"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouters } from "./routers-provider";

type RouterDialogProps = { open: boolean; onOpenChange: (open: boolean) => void };

/** Creates a new smart router; models and groups are chosen on its own page. */
export function RouterDialog({ open, onOpenChange }: RouterDialogProps) {
  const router = useRouter();
  const { routers, addRouter } = useRouters();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return setError("نام مسیریاب را بنویسید.");
    if (routers.some((item) => item.name.trim() === trimmed)) return setError("مسیریابی با این نام وجود دارد.");
    const id = addRouter(trimmed, description);
    toast.success("مسیریاب ساخته شد.");
    setName("");
    setDescription("");
    onOpenChange(false);
    router.push(`/admin/models/router/${id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>مسیریاب هوشمند تازه</DialogTitle>
          <DialogDescription>برای هر دسته از کاربران می‌توانید مسیریابی با مدل‌های خودش بسازید. نام آن در پنل کاربر به‌جای «خودکار» دیده می‌شود.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={(event) => { event.preventDefault(); submit(); }} className="grid gap-4">
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="router-name">نام</FieldLabel>
            <Input id="router-name" value={name} onChange={(event) => { setName(event.target.value); setError(null); }} aria-invalid={Boolean(error)} placeholder="مثلاً خودکار — مالی" />
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="router-description">توضیح (اختیاری)</FieldLabel>
            <Textarea id="router-description" rows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
            <FieldDescription>برای شما؛ کاربران این توضیح را نمی‌بینند.</FieldDescription>
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
