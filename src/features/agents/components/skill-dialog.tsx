"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSkillLibrary } from "../data/agents";

type SkillDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (content: { name: string; description: string; instructions: string }) => void;
};

/** Import a ready-made skill or write a personal one. Both wait for admin approval. */
export function SkillDialog({ open, onOpenChange, onAdd }: SkillDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState<string[]>([]);

  function create() {
    if (!name.trim()) {
      setError("نام مهارت را بنویسید.");
      return;
    }
    onAdd({ name: name.trim(), description: description.trim(), instructions: "" });
    setName("");
    setDescription("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن مهارت</DialogTitle>
          <DialogDescription>مهارت تازه تا تأیید ادمین غیرفعال است و در آزمایش و اجرای Agent استفاده نمی‌شود.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="library">
          <TabsList>
            <TabsTrigger value="library">مهارت آماده</TabsTrigger>
            <TabsTrigger value="personal">مهارت شخصی</TabsTrigger>
          </TabsList>
          <TabsContent value="library" className="flex flex-col gap-2 pt-3">
            {getSkillLibrary().map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex flex-col"><span className="text-label">{item.name}</span><span className="text-caption text-muted-foreground">{item.description}</span></div>
                <Button size="sm" variant="outline" disabled={imported.includes(item.id)} onClick={() => { onAdd({ name: item.name, description: item.description, instructions: item.instructions }); setImported((list) => [...list, item.id]); }}>
                  {imported.includes(item.id) ? "افزوده شد" : "وارد کردن"}
                </Button>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="personal" className="pt-3">
            <form onSubmit={(event) => { event.preventDefault(); create(); }} className="grid gap-4">
              <Field data-invalid={error ? true : undefined}>
                <FieldLabel htmlFor="skill-name">نام مهارت</FieldLabel>
                <Input id="skill-name" value={name} onChange={(event) => { setName(event.target.value); setError(null); }} aria-invalid={Boolean(error)} />
                {error ? <FieldError>{error}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="skill-description">توضیح</FieldLabel>
                <Input id="skill-description" value={description} onChange={(event) => setDescription(event.target.value)} />
              </Field>
              <Button type="submit" className="w-fit">ساخت مهارت</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
