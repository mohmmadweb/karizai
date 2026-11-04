"use client";

import { useState } from "react";
import { toast } from "sonner";
import { EyeOffIcon, PaperclipIcon, PencilIcon, SendIcon, SparklesIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { formatDate } from "@/admin/lib/format";
import { useOrgSkills, type OrgSkill } from "@/lib/org-skills";
import { SkillDialog, type SkillDraft } from "./skill-dialog";

export function SkillsPageContent() {
  const { skills, setSkills } = useOrgSkills();
  const { groups } = useDirectory();
  const [dialog, setDialog] = useState<{ skill: OrgSkill | null } | null>(null);
  const [deleting, setDeleting] = useState<OrgSkill | null>(null);

  const groupNames = (s: OrgSkill) =>
    s.groupIds.length === 0 ? "همه‌ی کاربران" : s.groupIds.map((id) => groups.find((g) => g.id === id)?.name ?? id).join("، ");

  function save(draft: SkillDraft) {
    const editing = dialog?.skill;
    const now = new Date().toISOString();
    if (editing) {
      setSkills((list) => list.map((s) => (s.id === editing.id ? { ...s, ...draft, updatedAt: now } : s)));
    } else {
      setSkills((list) => [...list, { ...draft, id: `orgskill-${Date.now()}`, status: "draft", updatedAt: now }]);
    }
  }

  function toggle(skill: OrgSkill) {
    const status = skill.status === "published" ? "draft" : "published";
    setSkills((list) => list.map((s) => (s.id === skill.id ? { ...s, status } : s)));
    toast.success(status === "published" ? "مهارت منتشر شد و کاربران می‌توانند آن را به عامل اضافه کنند." : "انتشار مهارت لغو شد.");
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="مهارت‌ها"
        description="مهارت‌های سازمانی را بارگذاری و منتشر کنید تا کاربران بتوانند آن‌ها را به عامل خود اضافه کنند."
        action={<Button onClick={() => setDialog({ skill: null })}><UploadIcon aria-hidden />بارگذاری مهارت</Button>}
      />
      {skills.length === 0 ? (
        <EmptyState icon={<SparklesIcon aria-hidden />} title="هنوز مهارتی بارگذاری نشده" description="اولین مهارت سازمانی را بارگذاری کنید."
          action={<Button onClick={() => setDialog({ skill: null })}>بارگذاری مهارت</Button>} />
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {skills.map((skill) => (
            <li key={skill.id} className="flex flex-col gap-4 rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col gap-1">
                  <h2 className="text-base font-semibold">{skill.name}</h2>
                  <p className="text-body-sm text-muted-foreground">{skill.description}</p>
                </div>
                <Badge variant={skill.status === "published" ? "success" : "secondary"}>{skill.status === "published" ? "منتشرشده" : "پیش‌نویس"}</Badge>
              </div>
              <pre dir="rtl" className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted p-3 font-sans text-body-sm">{skill.instructions || "بدون دستورالعمل متنی؛ محتوا در فایل پیوست است."}</pre>
              {skill.files.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {skill.files.map((f) => (
                    <li key={f}><Badge variant="outline"><PaperclipIcon aria-hidden /><bdi dir="ltr">{f}</bdi></Badge></li>
                  ))}
                </ul>
              ) : null}
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-body-sm">
                <dt className="text-muted-foreground">نسخه</dt><dd>{skill.version.replace("/", "٫")}</dd>
                <dt className="text-muted-foreground">گروه‌های مجاز</dt><dd>{groupNames(skill)}</dd>
                <dt className="text-muted-foreground">آخرین به‌روزرسانی</dt><dd>{formatDate(skill.updatedAt)}</dd>
              </dl>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={skill.status === "published" ? "outline" : "default"} onClick={() => toggle(skill)}>
                  {skill.status === "published" ? <><EyeOffIcon aria-hidden />لغو انتشار</> : <><SendIcon aria-hidden />انتشار</>}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDialog({ skill })}><PencilIcon aria-hidden />ویرایش</Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(skill)}><Trash2Icon aria-hidden />حذف</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <SkillDialog
        key={dialog?.skill?.id ?? "new"}
        skill={dialog?.skill ?? null}
        open={dialog !== null}
        onOpenChange={(open) => { if (!open) setDialog(null); }}
        onSave={save}
      />
      <AlertDialog open={deleting !== null} onOpenChange={(open) => { if (!open) setDeleting(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>مهارت «{deleting?.name}» حذف شود؟</AlertDialogTitle>
            <AlertDialogDescription>این مهارت از فهرست کاربران برداشته می‌شود و عامل‌هایی که از آن استفاده می‌کنند دیگر به آن دسترسی ندارند.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => {
              const id = deleting?.id;
              setSkills((list) => list.filter((s) => s.id !== id));
              toast.success("مهارت حذف شد.");
            }}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
