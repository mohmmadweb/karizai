"use client";

import { useState } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { FilterSelect, optionsOf } from "@/admin/features/audit/components/filter-select";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { usePolicies, type Permission, type PermissionGrant } from "@/lib/policy-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GrantDialog, kindLabels, permissionItems } from "./grant-dialog";

/** «مجوز خواندن / نوشتن»: per group and resource, read only or read and write. */
export function GrantsTab() {
  const { grants, setGrants } = usePolicies();
  const { groups } = useDirectory();
  const [group, setGroup] = useState("all");
  const [adding, setAdding] = useState(false);
  const rows = grants.filter((g) => group === "all" || g.groupName === group);
  const setPermission = (id: string, permission: Permission) =>
    setGrants((list) => list.map((g) => (g.id === id ? { ...g, permission } : g)));

  const columns: DataTableColumn<PermissionGrant>[] = [
    { id: "group", header: "گروه", cell: (g) => <span className="font-medium">{g.groupName}</span> },
    { id: "resource", header: "منبع", cell: (g) => g.resource },
    { id: "kind", header: "نوع", hideBelow: "lg", cell: (g) => <Badge variant="outline">{kindLabels[g.resourceKind]}</Badge> },
    {
      id: "permission",
      header: "مجوز",
      cell: (g) => (
        <Select items={permissionItems} value={g.permission} onValueChange={(v) => v && setPermission(g.id, v as Permission)}>
          <SelectTrigger size="sm" className="w-40" aria-label={`مجوز ${g.groupName} برای ${g.resource}`}><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{permissionItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <FilterSelect id="grant-filter-group" label="گروه" value={group} options={optionsOf(grants.map((g) => g.groupName))} onValueChange={setGroup} />
        <Button onClick={() => setAdding(true)}>
          <PlusIcon aria-hidden />
          افزودن مجوز
        </Button>
      </div>
      <DataTable
        label="مجوزهای خواندن و نوشتن"
        rows={rows}
        columns={columns}
        getRowId={(g) => g.id}
        getRowLabel={(g) => `مجوز ${g.groupName} برای ${g.resource}`}
        getRowActions={(g) => [[{
          label: "برداشتن مجوز", icon: <Trash2Icon aria-hidden />, destructive: true,
          onSelect: () => { setGrants((list) => list.filter((x) => x.id !== g.id)); toast.success("مجوز برداشته شد."); },
          confirm: { title: `مجوز «${g.resource}» از گروه ${g.groupName} برداشته شود؟`, description: "اعضای این گروه و عامل‌هایشان دیگر به این منبع دسترسی ندارند.", confirmLabel: "برداشتن" },
        }]]}
      />
      <GrantDialog
        open={adding}
        onOpenChange={setAdding}
        groups={groups.filter((g) => g.status === "active").map((g) => ({ value: g.id, label: g.name }))}
        onSave={(grant) => {
          const next = Math.max(0, ...grants.map((g) => Number(g.id.replace(/\D/g, "")) || 0)) + 1;
          setGrants((list) => [...list, { ...grant, id: `perm-${next}` }]);
          toast.success("مجوز اضافه شد.");
          setAdding(false);
        }}
      />
    </div>
  );
}
