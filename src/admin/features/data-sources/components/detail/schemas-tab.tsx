"use client";

import { useState } from "react";
import { DatabaseZapIcon, LayersIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { AccessGrantsPanel } from "@/admin/components/shared/access-grants-panel";
import { EmptyState } from "@/components/shared/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { groupAccessSide, userAccessSide } from "@/admin/features/access-control/lib/access-sides";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { useDataSources } from "../../hooks/use-data-sources";
import type { DataSchema, DataSource } from "../../types";
import { SchemaCard } from "./schema-card";
import { SchemaDialog } from "./schema-dialog";

type Props = { source: DataSource; onGoToInfo: () => void };

export function SchemasTab({ source, onGoToInfo }: Props) {
  const { schemas: structure, dataSchemas, addDataSchema, updateDataSchema, deleteDataSchema } = useDataSources();
  const { users, groups, memberships } = useDirectory();
  const { grants, grant, revoke, revokeAllForResources } = useAccess();
  const [editing, setEditing] = useState<{ schema: DataSchema | null } | null>(null);
  const [accessOf, setAccessOf] = useState<DataSchema | null>(null);
  const [deleting, setDeleting] = useState<DataSchema | null>(null);
  const tables = structure[source.id];
  const mine = dataSchemas.filter((s) => s.sourceId === source.id);
  const countOf = (id: string) => grants.filter((g) => g.resourceType === "schema" && g.resourceId === id).length;

  if (!tables) {
    return (
      <EmptyState
        icon={<DatabaseZapIcon />}
        title="ابتدا اتصال را آزمایش کنید"
        description="جدول‌های اسکیما بعد از یک آزمایش موفق از ساختار انبار داده خوانده می‌شود."
        action={<Button variant="outline" onClick={onGoToInfo}>رفتن به آزمایش اتصال</Button>}
      />
    );
  }

  const input = accessOf && { resourceType: "schema" as const, resourceId: accessOf.id, grants, users, groups, memberships, alsoVia: { resourceType: "database" as const, resourceId: source.id, label: "دسترسی کل انبار" } };
  const key = (type: "group" | "user", id: string) => ({ resourceType: "schema" as const, resourceId: accessOf!.id, subjectType: type, subjectId: id });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-reading text-body-sm text-muted-foreground">
          اسکیما مجموعه‌ای از جدول‌های این پایگاه است. هر کس به یک اسکیما دسترسی بگیرد فقط جدول‌های همان اسکیما را می‌بیند.
        </p>
        <Button className="min-h-10" onClick={() => setEditing({ schema: null })}>
          <PlusIcon data-icon="inline-start" aria-hidden />
          اسکیمای تازه
        </Button>
      </div>
      {mine.length === 0 ? (
        <EmptyState
          icon={<LayersIcon />}
          title="هنوز اسکیمایی تعریف نشده"
          description="اسکیما بسازید تا دسترسی را به بخشی از جدول‌ها بدهید."
          action={<Button onClick={() => setEditing({ schema: null })}>اسکیمای تازه</Button>}
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {mine.map((schema) => (
            <li key={schema.id}>
              <SchemaCard
                schema={schema}
                tables={tables}
                accessCount={countOf(schema.id)}
                onEdit={() => setEditing({ schema })}
                onAccess={() => setAccessOf(schema)}
                onDelete={() => setDeleting(schema)}
              />
            </li>
          ))}
        </ul>
      )}
      <SchemaDialog
        open={editing !== null}
        onOpenChange={(open) => { if (!open) setEditing(null); }}
        schema={editing?.schema ?? null}
        siblings={mine}
        tables={tables}
        onSubmit={(values) => {
          if (editing?.schema) updateDataSchema(editing.schema.id, values);
          else addDataSchema(source.id, values);
          toast.success(editing?.schema ? "اسکیما ذخیره شد." : "اسکیما ساخته شد؛ دسترسی را تعیین کنید.");
          setEditing(null);
        }}
      />
      <Dialog open={accessOf !== null} onOpenChange={(open) => { if (!open) setAccessOf(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>دسترسی به اسکیمای «{accessOf?.name}»</DialogTitle>
            <DialogDescription>هر کس اینجا اضافه شود فقط جدول‌های همین اسکیما را می‌بیند.</DialogDescription>
          </DialogHeader>
          {accessOf && input ? (
            <AccessGrantsPanel
              idPrefix="schema-access"
              groups={groupAccessSide(input)}
              users={userAccessSide(input)}
              emptyMessage="هنوز هیچ‌کس به این اسکیما دسترسی ندارد."
              onGrant={(type, id) => { grant(key(type, id)); toast.success(type === "group" ? "دسترسی گروه اضافه شد." : "دسترسی کاربر اضافه شد."); }}
              onRevoke={(type, id) => { revoke(key(type, id)); toast.success("دسترسی برداشته شد."); }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleting !== null} onOpenChange={(open) => { if (!open) setDeleting(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف اسکیمای «{deleting?.name}»؟</AlertDialogTitle>
            <AlertDialogDescription>
              دسترسی‌های همین اسکیما برداشته می‌شود. جدول‌های اتصال و دسترسی کل انبار دست‌نخورده می‌ماند.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (!deleting) return;
                deleteDataSchema(deleting.id);
                revokeAllForResources([deleting.id]);
                toast.success("اسکیما حذف شد.");
                setDeleting(null);
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
