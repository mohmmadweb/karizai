"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronLeftIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { formatNumber } from "@/admin/lib/format";
import type { OrgUnit } from "../data/org";

const total = (u: OrgUnit): number => u.members + (u.children ?? []).reduce((s, c) => s + total(c), 0);

type Props = { root: OrgUnit; onMap: (unitId: string, groupId: string | null) => void };

/** The unit tree; each unit shows its manager, people, AD group and the Kariz group it maps to. */
export function OrgTree({ root, onMap }: Props) {
  return <ul role="tree" aria-label="ساختار سازمان" className="flex flex-col gap-2"><Node unit={root} depth={0} onMap={onMap} /></ul>;
}

function Node({ unit, depth, onMap }: { unit: OrgUnit; depth: number; onMap: Props["onMap"] }) {
  const { groups } = useDirectory();
  const [open, setOpen] = useState(depth < 2);
  const items = [{ value: "none", label: "بدون گروه" }, ...groups.filter((g) => g.status === "active").map((g) => ({ value: g.id, label: g.name }))];
  const hasChildren = Boolean(unit.children?.length);
  return (
    <li role="treeitem" aria-expanded={hasChildren ? open : undefined} aria-selected={false} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3" style={{ marginInlineStart: depth * 24 }}>
        {hasChildren ? (
          <button type="button" aria-label={open ? `بستن ${unit.name}` : `باز کردن ${unit.name}`} onClick={() => setOpen(!open)} className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            {open ? <ChevronDownIcon className="size-4" aria-hidden /> : <ChevronLeftIcon className="size-4" aria-hidden />}
          </button>
        ) : <span className="w-4" aria-hidden />}
        <span className="flex min-w-40 flex-1 flex-col">
          <span className="font-medium">{unit.name}</span>
          <span className="text-caption text-muted-foreground">مدیر: {unit.manager} · {formatNumber(total(unit))} نفر</span>
        </span>
        <Badge variant="outline"><bdi dir="ltr">{unit.adGroup}</bdi></Badge>
        <Select items={items} value={unit.groupId ?? "none"} onValueChange={(v) => v && onMap(unit.id, v === "none" ? null : v)}>
          <SelectTrigger size="sm" aria-label={`گروه کاریز برای ${unit.name}`} className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{items.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </div>
      {hasChildren && open ? <ul role="group" className="flex flex-col gap-2">{unit.children!.map((c) => <Node key={c.id} unit={c} depth={depth + 1} onMap={onMap} />)}</ul> : null}
    </li>
  );
}
