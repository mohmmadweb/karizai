"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PaperclipIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import type { OrgSkill } from "@/lib/org-skills";

export type SkillDraft = Pick<OrgSkill, "name" | "description" | "instructions" | "files" | "version" | "groupIds">;

type Props = {
  /** The skill being edited; null uploads a new one. */
  skill: OrgSkill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (draft: SkillDraft) => void;
};

function SkillForm({ skill, onSave, onClose }: { skill: OrgSkill | null; onSave: Props["onSave"]; onClose: () => void }) {
  const { groups } = useDirectory();
  const [name, setName] = useState(skill?.name ?? "");
  const [description, setDescription] = useState(skill?.description ?? "");
  const [instructions, setInstructions] = useState(skill?.instructions ?? "");
  const [version, setVersion] = useState(skill?.version ?? "۱٫۰");
  const [files, setFiles] = useState<string[]>(skill?.files ?? []);
  const [groupIds, setGroupIds] = useState<string[]>(skill?.groupIds ?? []);
  const [errors, setErrors] = useState<{ name?: string; instructions?: string }>({});

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = {
      name: name.trim() ? undefined : "نام اسکیل را وارد کنید.",
      instructions: instructions.trim() || files.length > 0 ? undefined : "دستورالعمل را بنویسید یا فایل اسکیل را بارگذاری کنید.",
    };
    setErrors(next);
    if (next.name || next.instructions) return;
    onSave({ name: name.trim(), description: description.trim(), instructions: instructions.trim(), files, version: version.trim() || "۱٫۰", groupIds });
    onClose();
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <FieldGroup className="max-h-[60vh] overflow-y-auto pe-1">
        <Field data-invalid={errors.name ? true : undefined}>
          <FieldLabel htmlFor="skill-name">نام اسکیل</FieldLabel>
          <Input id="skill-name" value={name} aria-invalid={errors.name ? true : undefined} onChange={(e) => setName(e.target.value)} />
          {errors.name ? <FieldError>{errors.name}</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="skill-desc">توضیح کوتاه</FieldLabel>
          <Input id="skill-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field data-invalid={errors.instructions ? true : undefined}>
          <FieldLabel htmlFor="skill-instructions">دستورالعمل (مانند SKILL.md)</FieldLabel>
          <Textarea id="skill-instructions" rows={8} value={instructions} aria-invalid={errors.instructions ? true : undefined}
            onChange={(e) => setInstructions(e.target.value)} />
          {errors.instructions ? <FieldError>{errors.instructions}</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="skill-file">فایل‌های پیوست</FieldLabel>
          <Input id="skill-file" type="file" multiple accept=".md,.zip,.docx,.pptx"
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? []).map((f) => f.name);
              setFiles((prev) => [...prev, ...picked.filter((n) => !prev.includes(n))]);
              e.target.value = "";
            }} />
          <FieldDescription>قالب‌های .md، .zip، .docx و .pptx. فایل‌ها فقط موقتاً نگه داشته می‌شوند.</FieldDescription>
          {files.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {files.map((f) => (
                <li key={f} className="flex items-center gap-2 text-body-sm">
                  <PaperclipIcon aria-hidden className="size-4 text-muted-foreground" />
                  <bdi dir="ltr" className="min-w-0 flex-1 truncate">{f}</bdi>
                  <Button type="button" variant="ghost" size="icon-xs" aria-label={`حذف ${f}`} onClick={() => setFiles(files.filter((x) => x !== f))}><XIcon aria-hidden /></Button>
                </li>
              ))}
            </ul>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="skill-version">نسخه</FieldLabel>
          <Input id="skill-version" className="w-32" value={version} onChange={(e) => setVersion(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel>گروه‌های مجاز به استفاده</FieldLabel>
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={groupIds.length === 0} onCheckedChange={(v) => { if (v === true) setGroupIds([]); }} />
            <span>همه‌ی کاربران</span>
          </label>
          {groups.filter((g) => g.status === "active").map((g) => (
            <label key={g.id} className="flex cursor-pointer items-center gap-3">
              <Checkbox checked={groupIds.includes(g.id)}
                onCheckedChange={(v) => setGroupIds((ids) => (v === true ? [...ids, g.id] : ids.filter((x) => x !== g.id)))} />
              <span>{g.name}</span>
            </label>
          ))}
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="submit">{skill ? "ذخیره" : "بارگذاری"}</Button>
        <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
      </DialogFooter>
    </form>
  );
}

export function SkillDialog({ skill, open, onOpenChange, onSave }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skill ? "ویرایش اسکیل" : "بارگذاری اسکیل"}</DialogTitle>
          <DialogDescription>اسکیل سازمانی پس از انتشار برای کاربرانِ گروه‌های مجاز قابل افزودن به Agent است.</DialogDescription>
        </DialogHeader>
        {open ? <SkillForm skill={skill} onSave={(d) => { onSave(d); toast.success(skill ? "اسکیل ذخیره شد." : "اسکیل بارگذاری شد؛ به‌صورت پیش‌نویس ذخیره شد."); }} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}
