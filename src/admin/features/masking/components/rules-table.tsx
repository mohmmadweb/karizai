"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableActionGroup, DataTableColumn } from "@/admin/components/shared/data-table/types";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { MaskField as MaskRule } from "@/lib/policy-store";
import { detectionOf } from "../lib/fields";

type Props = {
  rules: MaskRule[];
  onEdit: (rule: MaskRule) => void;
  onDelete: (rule: MaskRule) => void;
  onEnabledChange: (rule: MaskRule, enabled: boolean) => void;
};

function ActionBadge({ rule }: { rule: MaskRule }) {
  return rule.action === "replace" ? (
    <Badge variant="success">جایگزینی با [{rule.label} ۱]</Badge>
  ) : (
    <Badge variant="destructive">ممنوع: فقط مدل داخلی</Badge>
  );
}

/** Masking rules in the order they run. */
export function RulesTable({ rules, onEdit, onDelete, onEnabledChange }: Props) {
  const columns: DataTableColumn<MaskRule>[] = [
    { id: "name", header: "نوع داده", cell: (r) => <span className="font-medium">{r.label}</span> },
    {
      id: "sample",
      header: "نمونه",
      hideBelow: "lg",
      className: "text-body-sm text-muted-foreground",
      cell: (r) => <bdi dir="ltr">{r.sample}</bdi>,
    },
    { id: "detection", header: "تشخیص", cell: (r) => <Badge variant="outline">{detectionOf(r)}</Badge> },
    { id: "action", header: "اقدام پیش از مدل بیرونی", cell: (r) => <ActionBadge rule={r} /> },
    {
      id: "enabled",
      header: "فعال",
      cell: (r) => (
        <Switch
          checked={r.enabled}
          onCheckedChange={(checked) => onEnabledChange(r, checked)}
          aria-label={`قاعده‌ی ${r.label} فعال باشد`}
        />
      ),
    },
  ];

  const actionsOf = (rule: MaskRule): DataTableActionGroup[] => [
    [{ label: "ویرایش", icon: <PencilIcon aria-hidden />, inline: true, onSelect: () => onEdit(rule) }],
    [
      {
        label: "حذف قاعده",
        icon: <Trash2Icon aria-hidden />,
        destructive: true,
        onSelect: () => onDelete(rule),
        confirm: {
          title: `قاعده‌ی «${rule.label}» حذف شود؟`,
          description: "از این پس این نوع داده پیش از رفتن به مدل بیرونی پوشانده نمی‌شود.",
          confirmLabel: "حذف قاعده",
        },
      },
    ],
  ];

  return (
    <DataTable
      label="قاعده‌های پوشاندن داده"
      rows={rules}
      columns={columns}
      getRowId={(r) => r.id}
      getRowLabel={(r) => `قاعده‌ی ${r.label}`}
      getRowActions={actionsOf}
      hidePagerWhenSingle
      renderCard={(r, actions) => (
        <>
          <div className="flex items-start justify-between gap-3">
            <span className="font-medium">{r.label}</span>
            <div className="flex items-center gap-2">
              <Switch checked={r.enabled} onCheckedChange={(c) => onEnabledChange(r, c)} aria-label={`قاعده‌ی ${r.label} فعال باشد`} />
              {actions}
            </div>
          </div>
          <bdi dir="ltr" className="text-body-sm text-muted-foreground">{r.sample}</bdi>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{detectionOf(r)}</Badge>
            <ActionBadge rule={r} />
          </div>
        </>
      )}
    />
  );
}
