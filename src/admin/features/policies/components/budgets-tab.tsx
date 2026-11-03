"use client";

import { useState } from "react";
import { PencilIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { formatNumber } from "@/admin/lib/format";
import { tomanPer1kTokens, usePolicies, type GroupBudget } from "@/lib/policy-store";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BudgetDialog } from "./budget-dialog";

const behaviorItems: { value: GroupBudget["onExhausted"]; label: string }[] = [
  { value: "internal-light", label: "تغییر به مدل داخلی سبک" },
  { value: "notify", label: "ادامه با هشدار به مدیر گروه" },
  { value: "lock", label: "توقف تا هفته‌ی بعد" },
];

const toman = (n: number) => `${formatNumber(n)} تومان`;

/** «بودجه تومانی گروه‌ها»: weekly toman budget per group and what happens when it runs out. */
export function BudgetsTab() {
  const { budgets, setBudgets } = usePolicies();
  const { groups } = useDirectory();
  const [editing, setEditing] = useState<GroupBudget | "new" | null>(null);
  const patch = (groupId: string, p: Partial<GroupBudget>) =>
    setBudgets((list) => list.map((b) => (b.groupId === groupId ? { ...b, ...p } : b)));
  const freeGroups = groups.filter((g) => g.status === "active" && !budgets.some((b) => b.groupId === g.id)).map((g) => ({ value: g.id, label: g.name }));

  const columns: DataTableColumn<GroupBudget>[] = [
    { id: "group", header: "گروه", cell: (b) => <span className="font-medium">{b.groupName}</span> },
    { id: "budget", header: "بودجه‌ی هفتگی", align: "end", cell: (b) => toman(b.weeklyToman) },
    {
      id: "usage",
      header: "مصرف این هفته",
      cell: (b) => {
        const share = Math.min(1, b.spentToman / b.weeklyToman);
        const high = share >= 0.85;
        return (
          <div className="flex min-w-40 flex-col gap-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
              <div className={high ? "h-full rounded-full bg-destructive" : "h-full rounded-full bg-primary"} style={{ width: `${Math.round(share * 100)}%` }} />
            </div>
            <span className="text-caption tabular-nums text-muted-foreground">
              {toman(b.spentToman)} · {formatNumber(share, { style: "percent" })}{high ? " · نزدیک سقف" : ""}
            </span>
          </div>
        );
      },
    },
    {
      id: "left",
      header: "مانده",
      hideBelow: "lg",
      cell: (b) => {
        const left = Math.max(0, b.weeklyToman - b.spentToman);
        return (
          <span className="flex flex-col">
            <span className="tabular-nums">{toman(left)}</span>
            <span className="text-caption text-muted-foreground">
              حدود {formatNumber(Math.floor(left / tomanPer1kTokens.external))} هزار توکن بیرونی
            </span>
          </span>
        );
      },
    },
    {
      id: "behavior",
      header: "پس از اتمام",
      cell: (b) => (
        <Select items={behaviorItems} value={b.onExhausted} onValueChange={(v) => v && patch(b.groupId, { onExhausted: v as GroupBudget["onExhausted"] })}>
          <SelectTrigger size="sm" className="w-52" aria-label={`رفتار پس از اتمام بودجه‌ی ${b.groupName}`}><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{behaviorItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-reading text-body-sm text-muted-foreground">
          همه‌ی توکن‌ها به تومان حساب می‌شوند: هر هزار توکن مدل داخلی {formatNumber(tomanPer1kTokens.internal)} تومان و مدل بیرونی{" "}
          {formatNumber(tomanPer1kTokens.external)} تومان.
        </p>
        <Button disabled={freeGroups.length === 0} onClick={() => setEditing("new")}>
          <PlusIcon aria-hidden />
          افزودن بودجه
        </Button>
      </div>
      <DataTable
        label="بودجه‌ی تومانی گروه‌ها"
        rows={budgets}
        columns={columns}
        getRowId={(b) => b.groupId}
        getRowLabel={(b) => `بودجه‌ی گروه ${b.groupName}`}
        getRowActions={(b) => [[{ label: "تغییر بودجه", icon: <PencilIcon aria-hidden />, inline: true, onSelect: () => setEditing(b) }]]}
        hidePagerWhenSingle
      />
      <BudgetDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        groupName={editing && editing !== "new" ? editing.groupName : undefined}
        initialToman={editing && editing !== "new" ? editing.weeklyToman : undefined}
        groups={freeGroups}
        onSave={(groupId, weeklyToman) => {
          if (editing && editing !== "new") patch(editing.groupId, { weeklyToman });
          else if (groupId) {
            const name = groups.find((g) => g.id === groupId)?.name ?? "";
            setBudgets((list) => [...list, { groupId, groupName: name, weeklyToman, spentToman: 0, onExhausted: "internal-light" }]);
          }
          toast.success("بودجه ذخیره شد.");
          setEditing(null);
        }}
      />
    </div>
  );
}
