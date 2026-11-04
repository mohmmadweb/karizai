"use client";

import { useState } from "react";
import { DatabaseZapIcon, LayersIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
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
import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { useDataSources } from "../../hooks/use-data-sources";
import type { DataSchema, DataSource } from "../../types";
import { SchemaCard } from "./schema-card";
import { SchemaDialog } from "./schema-dialog";

type Props = { source: DataSource; onGoToInfo: () => void };

export function SchemasTab({ source, onGoToInfo }: Props) {
  const { schemas: structure, dataSchemas, addDataSchema, updateDataSchema, deleteDataSchema } = useDataSources();
  const { grants, revokeAllForResources } = useAccess();
  const [editing, setEditing] = useState<{ schema: DataSchema | null } | null>(null);
  const [deleting, setDeleting] = useState<DataSchema | null>(null);
  const tables = structure[source.id];
  const mine = dataSchemas.filter((s) => s.sourceId === source.id);
  const countOf = (id: string) => grants.filter((g) => g.resourceType === "schema" && g.resourceId === id && g.subjectType === "group").length;

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-reading text-body-sm text-muted-foreground">
          اسکیما مجموعه‌ای از جدول‌های این پایگاه است. دسترسی هر اسکیما را از تب «داده» در صفحه‌ی هر گروه می‌دهید و هر گروهی که آن را بگیرد فقط جدول‌های همان اسکیما را می‌بیند.
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
