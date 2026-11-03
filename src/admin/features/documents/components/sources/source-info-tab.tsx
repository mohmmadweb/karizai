"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { formatNumber } from "@/admin/lib/format";
import { simulateRequest } from "@/lib/simulate-request";
import { useDeleteDocuments } from "../../hooks/use-delete-document";
import { useDocuments } from "../../hooks/use-documents";
import { documentsOfSource } from "../../lib/selectors";
import { formFromSource, hasErrors, toInput, validateForm, type SourceFormErrors, type SourceFormValues } from "../../lib/source-form";
import type { FileSource } from "../../types";
import { SourceFields } from "./source-fields";
import { SourceSyncSection } from "./source-sync-section";
import { SourceTestSection } from "./source-test-section";

export function SourceInfoTab({ source }: { source: FileSource }) {
  const { updateSource, documents } = useDocuments();
  const { removeSource } = useDeleteDocuments();
  const router = useRouter();
  const saved = formFromSource(source);
  const [values, setValues] = useState<SourceFormValues>(saved);
  const [errors, setErrors] = useState<SourceFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const unchanged = JSON.stringify(values) === JSON.stringify(saved);
  const count = documentsOfSource(source.id, documents).length;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving || unchanged) return;
    const next = validateForm(values, false);
    setErrors(next);
    if (hasErrors(next)) return;
    setSaving(true);
    await simulateRequest();
    const result = updateSource(source.id, toInput(values));
    setSaving(false);
    if (!result.ok) return setErrors({ name: result.error });
    toast.success("اطلاعات منبع به‌روز شد.");
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <FieldGroup className="md:grid md:grid-cols-2 md:gap-x-4">
          <SourceFields idPrefix="edit-fsource" values={values} errors={errors} disabled={saving} passwordOptional onChange={setValues} onErrors={setErrors} />
        </FieldGroup>
        <p className="text-body-sm text-muted-foreground">
          تغییر پروتکل، نشانی، درگاه، مسیر، نام کاربری یا رمز، نتیجه‌ی آزمایش را پاک می‌کند. تغییر نام این اثر را ندارد.
        </p>
        <div><Button type="submit" loading={saving} disabled={unchanged}>ذخیره</Button></div>
      </form>
      <SourceTestSection source={source} />
      <SourceSyncSection source={source} />
      <section className="flex flex-col gap-3 border-t border-border pt-8">
        <h2 className="text-h4 text-foreground">حذف منبع</h2>
        <p className="text-body-sm text-muted-foreground">اسناد آمده از این منبع از سامانه برداشته می‌شود؛ فایل‌های فایل‌سرور دست‌نخورده می‌ماند.</p>
        <div><Button variant="destructive" onClick={() => setConfirming(true)}>حذف منبع</Button></div>
      </section>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>منبع «{source.name}» حذف شود؟</AlertDialogTitle>
            <AlertDialogDescription>
              {formatNumber(count)} سند آمده از این منبع و دسترسی‌هایشان از سامانه برداشته می‌شود. فایل‌های فایل‌سرور دست‌نخورده می‌ماند.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                removeSource(source.id);
                toast.success("منبع حذف شد.");
                router.push("/admin/documents");
              }}
            >
              حذف
            </Button>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
