"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { BackLink } from "@/components/shared/back-link";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { PageHeader } from "@/components/shared/page-header";
import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { RouterMembers } from "./router-members";
import { RouterTestPanel } from "./router-test-panel";
import { RouterWeightsEditor } from "./router-weights";
import { useRouters } from "./routers-provider";

export function RouterDetail({ routerId }: { routerId: string }) {
  const nav = useRouter();
  const { routers, updateRouter, removeRouter } = useRouters();
  const { groups } = useDirectory();
  const router = routers.find((item) => item.id === routerId);
  const [name, setName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (!router) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink href="/admin/models">بازگشت به مدل‌ها</BackLink>
        <EntityNotFound title="مسیریاب پیدا نشد" backHref="/admin/models" backLabel="بازگشت به مدل‌ها" />
      </div>
    );
  }
  const draftName = name ?? router.name;
  const groupItems = groups.filter((g) => g.status === "active" || router.groupIds.includes(g.id)).map((g) => ({ value: g.id, label: g.name }));

  function saveName() {
    const trimmed = draftName.trim();
    if (!trimmed) return setError("نام مسیریاب را بنویسید.");
    if (routers.some((item) => item.id !== routerId && item.name.trim() === trimmed)) return setError("مسیریابی با این نام وجود دارد.");
    updateRouter(routerId, { name: trimmed });
    setName(null);
    toast.success("نام ذخیره شد.");
  }

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/models">بازگشت به مدل‌ها</BackLink>
      <PageHeader
        title={<span className="flex flex-wrap items-center gap-3">{router.name}{router.isDefault ? <Badge variant="info">پیش‌فرض</Badge> : null}</span>}
                action={router.isDefault ? undefined : <Button variant="outline" onClick={() => setConfirming(true)}><Trash2Icon aria-hidden />حذف مسیریاب</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="router-detail-name">نام</FieldLabel>
          <div className="flex gap-2">
            <Input id="router-detail-name" value={draftName} disabled={router.isDefault} onChange={(event) => { setName(event.target.value); setError(null); }} aria-invalid={Boolean(error)} />
            {router.isDefault ? null : <Button type="button" disabled={name === null || name.trim() === router.name} onClick={saveName}>ذخیره</Button>}
          </div>
          {error ? <FieldError>{error}</FieldError> : router.isDefault ? <FieldDescription>نام مسیریاب پیش‌فرض همیشه «خودکار» است.</FieldDescription> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="router-groups">برای چه کسانی</FieldLabel>
          {router.isDefault ? (
            <p className="flex h-10 items-center text-body">همه‌ی کاربران</p>
          ) : (
            <SearchableMultiSelect id="router-groups" items={groupItems} value={router.groupIds} onValueChange={(ids) => updateRouter(routerId, { groupIds: ids })} placeholder="انتخاب گروه" searchPlaceholder="جست‌وجوی گروه" emptyText="گروهی پیدا نشد." />
          )}
          {router.isDefault ? null : <FieldDescription>تغییر همان لحظه اعمال می‌شود.</FieldDescription>}
        </Field>
      </div>
      <section className="flex flex-col gap-3" aria-label="مدل‌ها">
        <div className="flex flex-col gap-1">
          <h2 className="text-h4">مدل‌ها</h2>
          <p className="text-body-sm text-muted-foreground">برای هر مدل مشخص کنید پاسخ پرسش‌های ساده، متوسط یا پیچیده را بدهد. اگر برای سطحی مدلی نباشد، نزدیک‌ترین سطح استفاده می‌شود.</p>
        </div>
        <RouterMembers router={router} onChange={(members) => updateRouter(routerId, { members })} />
      </section>
      <section className="flex flex-col gap-3" aria-label="وزن معیارها">
        <div className="flex flex-col gap-1">
          <h2 className="text-h4">وزن کیفیت، سرعت و هزینه</h2>
          <p className="text-body-sm text-muted-foreground">وقتی چند مدل برای یک سطح هستند، مسیریاب با این وزن‌ها انتخاب می‌کند. تغییر همان لحظه اعمال می‌شود.</p>
        </div>
        <RouterWeightsEditor router={router} onChange={(weights) => updateRouter(routerId, { weights })} />
      </section>
      <details className="rounded-xl border p-4 [&_summary]:cursor-pointer">
        <summary className="text-label">آزمایش مسیریاب با یک پرسش نمونه</summary>
        <div className="pt-3"><RouterTestPanel router={router} /></div>
      </details>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>مسیریاب «{router.name}» حذف شود؟</AlertDialogTitle>
            <AlertDialogDescription>کاربران این گروه‌ها دیگر این گزینه را نمی‌بینند و فقط «خودکار» پیش‌فرض برایشان می‌ماند.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => { removeRouter(routerId); toast.success("مسیریاب حذف شد."); nav.push("/admin/models"); }}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
