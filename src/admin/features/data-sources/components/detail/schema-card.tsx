"use client";

import { LockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/admin/lib/format";
import type { DataSchema, SourceTable } from "../../types";

type Props = {
  schema: DataSchema;
  tables: SourceTable[];
  accessCount: number;
  onEdit: () => void;
  onDelete: () => void;
};

/** One schema: its tables, how many have access, and its actions. */
export function SchemaCard({ schema, tables, accessCount, onEdit, onDelete }: Props) {
  const names = schema.tableIds.map((id) => ({ id, name: tables.find((t) => t.id === id)?.name, gone: !tables.some((t) => t.id === id) }));
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <CardTitle className="flex flex-wrap items-center gap-2 text-h4">
            <bdi>{schema.name}</bdi>
            {schema.confidential ? <Badge variant="warning"><LockIcon aria-hidden />محرمانه</Badge> : null}
          </CardTitle>
          {schema.description ? <p className="text-body-sm text-muted-foreground">{schema.description}</p> : null}
        </div>
        <Badge variant={accessCount === 0 ? "warning" : "secondary"}>
          {accessCount === 0 ? "بدون دسترسی" : `${formatNumber(accessCount)} گروه`}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-body-sm text-muted-foreground">
          {formatNumber(names.length)} جدول · {schema.rowFilter ? `فیلتر سطری: ${schema.rowFilter}` : "همه‌ی سطرها"}
        </p>
        <ul className="flex flex-wrap gap-2">
          {names.map((n) => (
            <li key={n.id}>
              <Badge variant={n.gone ? "destructive" : "outline"}>
                <bdi dir="ltr">{n.name ?? n.id}</bdi>
                {n.gone ? " · دیگر در پایگاه نیست" : ""}
              </Badge>
            </li>
          ))}
        </ul>
        {accessCount === 0 ? <p className="text-body-sm text-muted-foreground">هنوز هیچ گروهی به این اسکیما دسترسی ندارد.</p> : null}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="min-h-10" onClick={onEdit}>ویرایش</Button>
          <Button variant="outline" className="min-h-10 text-destructive" onClick={onDelete}>حذف</Button>
        </div>
      </CardContent>
    </Card>
  );
}
