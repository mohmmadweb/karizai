"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { BackLink } from "@/components/shared/back-link";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { PageHeader } from "@/components/shared/page-header";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { ConnectionInfoForm } from "./connection-info-form";
import { ConnectionTools } from "./connection-tools";
import { useConnections } from "./connections-provider";

export function ConnectionDetail({ connectionId }: { connectionId: string }) {
  const nav = useRouter();
  const { connections, updateConnection, removeConnection } = useConnections();
  const { groups } = useDirectory();
  const [confirming, setConfirming] = useState(false);
  const connection = connections.find((item) => item.id === connectionId);

  if (!connection) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink href="/admin/connections">بازگشت به اتصال‌ها</BackLink>
        <EntityNotFound title="اتصال پیدا نشد" backHref="/admin/connections" backLabel="بازگشت به اتصال‌ها" />
      </div>
    );
  }
  const allowed = connection.groupIds.map((id) => ({ id, name: groups.find((g) => g.id === id)?.name ?? "گروه حذف‌شده" }));
  const canActivate = connection.tools.length > 0 && connection.groupIds.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/connections">بازگشت به اتصال‌ها</BackLink>
      <PageHeader
        title={<span className="flex flex-wrap items-center gap-3">{connection.name}{connection.active ? <Badge variant="success">فعال</Badge> : <Badge variant="secondary">غیرفعال</Badge>}</span>}
        action={<Button variant="outline" onClick={() => setConfirming(true)}><Trash2Icon aria-hidden />حذف اتصال</Button>}
      />
      <div className="flex flex-col gap-1 rounded-xl border p-4">
        <label className="flex items-center gap-3 text-label">
          <Switch checked={connection.active} disabled={!connection.active && !canActivate} onCheckedChange={(checked) => { updateConnection(connectionId, { active: checked }); toast.success(checked ? "اتصال فعال شد." : "اتصال غیرفعال شد."); }} aria-label="فعال بودن اتصال" />
          فعال برای کاربران
        </label>
        <p className="text-body-sm text-muted-foreground">{canActivate || connection.active ? "کاربرانِ گروه‌های مجاز این اتصال را می‌بینند و استفاده می‌کنند." : "برای فعال‌سازی، دست‌کم یک ابزار و یک گروه لازم است."}</p>
      </div>
      <section className="flex flex-col gap-3"><h2 className="text-h4">اطلاعات</h2><ConnectionInfoForm key={connection.id} connection={connection} /></section>
      <section className="flex flex-col gap-3"><h2 className="text-h4">ابزارها</h2><ConnectionTools tools={connection.tools} onChange={(tools) => updateConnection(connectionId, { tools, ...(tools.length === 0 ? { active: false } : {}) })} /></section>
      <section className="flex flex-col gap-3">
        <h2 className="text-h4">گروه‌های دارای دسترسی</h2>
        {allowed.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">هنوز هیچ گروهی دسترسی ندارد. دسترسی را از تب «اتصال‌ها» در صفحه‌ی هر گروه بدهید.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {allowed.map((g) => (
              <li key={g.id}>
                <Link href={`/admin/groups/${g.id}`} className="inline-flex min-h-10 items-center rounded-full border border-border px-3 text-body-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">{g.name}</Link>
              </li>
            ))}
          </ul>
        )}
        {allowed.length > 0 ? <p className="text-body-sm text-muted-foreground">دسترسی از صفحه‌ی هر گروه داده یا برداشته می‌شود.</p> : null}
      </section>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>اتصال «{connection.name}» حذف شود؟</AlertDialogTitle>
            <AlertDialogDescription>کاربران دیگر این اتصال و ابزارهایش را نمی‌بینند و کارها و Agentهایی که از آن استفاده می‌کنند دیگر اجرا نمی‌شوند.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => { removeConnection(connectionId); toast.success("اتصال حذف شد."); nav.push("/admin/connections"); }}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
