"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LockIcon, PencilIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { formatNumber } from "@/admin/lib/format";
import { useDataSources } from "../../hooks/use-data-sources";
import type { AccessSchema, DataSource } from "../../types";
import { GrantDialog, SchemaDialog } from "./schema-dialogs";

const EMPTY: AccessSchema[] = [];

/** Named table subsets of a database, each with read-only grants and optional row filters. */
export function SchemasTab({ source, onGoToInfo }: { source: DataSource; onGoToInfo: () => void }) {
  const { schemas, accessSchemas, deleteAccessSchema, removeSchemaGrant } = useDataSources();
  const { users, groups } = useDirectory();
  const tables = schemas[source.id];
  const list = accessSchemas[source.id] ?? EMPTY;
  const [editing, setEditing] = useState<{ schema: AccessSchema | null } | null>(null);
  const [grantFor, setGrantFor] = useState<string | null>(null);

  if (!tables) {
    return (
      <EmptyState
        title="هنوز ساختاری خوانده نشده"
        description="برای تعریف اسکیما، ابتدا اتصال را آزمایش کنید تا جدول‌ها خوانده شوند."
        action={<Button variant="outline" onClick={onGoToInfo}>رفتن به اطلاعات</Button>}
      />
    );
  }

  const tableName = (id: string) => tables.find((t) => t.id === id)?.name ?? id;
  const subjectName = (type: "group" | "user", id: string) =>
    (type === "group" ? groups.find((g) => g.id === id)?.name : users.find((u) => u.id === id)?.name) ?? id;
  const grantSchema = list.find((x) => x.id === grantFor) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body-sm text-muted-foreground">
          جدول‌ها را در اسکیما دسته‌بندی کنید و هر اسکیما را فقط‌خواندنی به گروه‌ها و کاربران بدهید.
        </p>
        <Button onClick={() => setEditing({ schema: null })}><PlusIcon aria-hidden />تعریف اسکیما</Button>
      </div>
      {list.length === 0 ? (
        <EmptyState title="هنوز اسکیمایی تعریف نشده" description="اولین اسکیما را با انتخاب چند جدول بسازید." />
      ) : (
        <ul className="flex flex-col gap-4">
          {list.map((schema) => (
            <li key={schema.id} className="flex flex-col gap-4 rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <bdi dir="ltr" className="text-base font-semibold">{schema.name}</bdi>
                    {schema.confidential ? <Badge variant="warning"><LockIcon aria-hidden />محرمانه</Badge> : null}
                    <Badge variant="secondary">{formatNumber(schema.tableIds.length)} جدول</Badge>
                  </div>
                  {schema.description ? <p className="text-body-sm text-muted-foreground">{schema.description}</p> : null}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" aria-label={`ویرایش اسکیمای ${schema.name}`} onClick={() => setEditing({ schema })}><PencilIcon aria-hidden /></Button>
                  <Button variant="ghost" size="icon-sm" aria-label={`حذف اسکیمای ${schema.name}`}
                    onClick={() => { deleteAccessSchema(source.id, schema.id); toast.success("اسکیما حذف شد."); }}><Trash2Icon aria-hidden /></Button>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2">
                {schema.tableIds.map((id) => (
                  <li key={id}><Badge variant="outline"><bdi dir="ltr">{tableName(id)}</bdi></Badge></li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-label font-medium">دسترسی‌ها (فقط‌خواندنی)</h3>
                  <Button variant="soft" size="sm" onClick={() => setGrantFor(schema.id)}><PlusIcon aria-hidden />افزودن دسترسی</Button>
                </div>
                {schema.grants.length === 0 ? (
                  <p className="text-body-sm text-muted-foreground">هنوز به هیچ گروه یا کاربری داده نشده است.</p>
                ) : (
                  <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
                    {schema.grants.map((g) => (
                      <li key={`${g.subjectType}-${g.subjectId}`} className="flex flex-wrap items-center gap-2 p-3">
                        <Badge variant={g.subjectType === "group" ? "info" : "secondary"}>{g.subjectType === "group" ? "گروه" : "کاربر"}</Badge>
                        <span className="font-medium">{subjectName(g.subjectType, g.subjectId)}</span>
                        <span className="text-body-sm text-muted-foreground">
                          {g.rowFilter ? `فیلتر سطری: ${g.rowFilter}` : "همه‌ی سطرها"}
                        </span>
                        <Button className="ms-auto" variant="ghost" size="icon-xs" aria-label={`برداشتن دسترسی ${subjectName(g.subjectType, g.subjectId)}`}
                          onClick={() => { removeSchemaGrant(source.id, schema.id, g.subjectType, g.subjectId); toast.success("دسترسی برداشته شد."); }}><XIcon aria-hidden /></Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <SchemaDialog
        key={editing?.schema?.id ?? "new"}
        source={source}
        tables={tables}
        schema={editing?.schema ?? null}
        open={editing !== null}
        onOpenChange={(open) => { if (!open) setEditing(null); }}
      />
      <GrantDialog source={source} schema={grantSchema} open={grantSchema !== null} onOpenChange={(open) => { if (!open) setGrantFor(null); }} />
    </div>
  );
}
