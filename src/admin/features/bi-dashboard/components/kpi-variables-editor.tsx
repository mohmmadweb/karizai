"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { KpiVariable } from "../types";

type Props = { variables: KpiVariable[]; onChange: (variables: KpiVariable[]) => void };

const NAMES = "abcdef";

/** The values read from the tool's answer. Each gets a short name (a, b, c) to use in the formula. */
export function KpiVariablesEditor({ variables, onChange }: Props) {
  const set = (index: number, patch: Partial<KpiVariable>) => onChange(variables.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  const add = () => {
    const name = [...NAMES].find((n) => !variables.some((v) => v.name === n));
    if (name) onChange([...variables, { name, label: "", value: 100 }]);
  };
  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {variables.map((v, i) => (
          <li key={v.name} className="flex items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-body-sm" dir="ltr">{v.name}</span>
            <Input aria-label={`مقداری که برای ${v.name} خوانده می‌شود`} placeholder="چه چیزی از پاسخ خوانده شود؟" autoComplete="off" name={`variable-${v.name}`} value={v.label} onChange={(e) => set(i, { label: e.target.value })} />
            <span className="w-24 shrink-0 text-end text-body-sm tabular-nums text-muted-foreground" title="آخرین مقدار خوانده‌شده">{v.value.toLocaleString("fa-IR")}</span>
            <Button type="button" variant="ghost" size="icon" aria-label={`حذف ${v.name}`} disabled={variables.length === 1} onClick={() => onChange(variables.filter((_, j) => j !== i))}><Trash2Icon aria-hidden /></Button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" className="w-fit" disabled={variables.length >= NAMES.length} onClick={add}><PlusIcon data-icon="inline-start" aria-hidden />مقدار تازه</Button>
    </div>
  );
}
