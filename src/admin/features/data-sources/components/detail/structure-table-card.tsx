"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/admin/lib/format";
import type { SourceTable } from "../../types";

type Props = {
  table: SourceTable;
  /** Draft descriptions by table id or `tableId:columnId`. */
  draft: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

/** One table: its description, and its columns when opened. */
export function StructureTableCard({ table, draft, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const described = Boolean(draft[table.id]?.trim());
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="ghost"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="min-w-0"
        >
          <ChevronDownIcon aria-hidden className={open ? "rotate-180" : undefined} />
          <bdi dir="ltr" className="font-medium">{table.name}</bdi>
          <span className="text-body-sm text-muted-foreground">
            {formatNumber(table.columns.length)} ستون
          </span>
        </Button>
        {described ? null : <Badge variant="secondary">بدون توضیح</Badge>}
      </div>
      <Input
        aria-label={`توضیح جدول ${table.name}`}
        placeholder="توضیح فارسی جدول"
        value={draft[table.id] ?? ""}
        onChange={(e) => onChange(table.id, e.target.value)}
      />
      {open ? (
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {table.columns.map((column) => (
            <li
              key={column.id}
              className="grid gap-2 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:items-center"
            >
              <div className="flex flex-wrap items-center gap-2" dir="ltr">
                <span className="font-medium">{column.name}</span>
                <span className="text-caption text-muted-foreground">{column.dataType}</span>
              </div>
              <Input
                aria-label={`توضیح ستون ${column.name} از جدول ${table.name}`}
                placeholder="توضیح فارسی ستون"
                value={draft[`${table.id}:${column.id}`] ?? ""}
                onChange={(e) => onChange(`${table.id}:${column.id}`, e.target.value)}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
