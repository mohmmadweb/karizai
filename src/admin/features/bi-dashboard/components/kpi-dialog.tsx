"use client";

import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConnections } from "@/admin/features/connections/components/connections-provider";
import { simulateRequest } from "@/lib/simulate-request";
import { getConnectionCatalog } from "../data/connection-catalog";
import { evaluateFormula, variableValues } from "../lib/formula";
import type { AreaKpi } from "../types";
import { useBi } from "./bi-provider";
import { KpiVariablesEditor } from "./kpi-variables-editor";

const betterItems = [{ value: "higher", label: "بالاتر بهتر است" }, { value: "lower", label: "پایین‌تر بهتر است" }];

/** Defined connections and the organization's known systems, each with its tools. */
function useConnectionTools(current: AreaKpi) {
  const { connections } = useConnections();
  return useMemo(() => {
    const map: Record<string, string[]> = { ...getConnectionCatalog() };
    for (const c of connections) if (c.active) map[c.name] = [...new Set([...(map[c.name] ?? []), ...c.tools.map((t) => t.name)])];
    map[current.source.connection] = [...new Set([...(map[current.source.connection] ?? []), current.source.tool])];
    return map;
  }, [connections, current]);
}

function KpiForm({ kpi, onClose }: { kpi: AreaKpi; onClose: () => void }) {
  const { updateKpi } = useBi();
  const tools = useConnectionTools(kpi);
  const [draft, setDraft] = useState(kpi);
  const [testing, setTesting] = useState(false);
  const { source } = draft;
  const setSource = (patch: Partial<AreaKpi["source"]>) => setDraft({ ...draft, source: { ...source, ...patch } });
  const result = evaluateFormula(source.formula, variableValues(source.variables));
  const targetBad = !Number.isFinite(draft.target);
  const connectionItems = Object.keys(tools).map((value) => ({ value, label: value }));
  const toolItems = (tools[source.connection] ?? []).map((value) => ({ value, label: value }));

  async function test() {
    setTesting(true);
    await simulateRequest(900);
    setTesting(false);
    toast.success(`${source.variables.length.toLocaleString("fa-IR")} مقدار از «${source.tool}» خوانده شد.`);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!result.ok || targetBad || !draft.label.trim() || source.variables.some((v) => !v.label.trim())) return;
    updateKpi({ ...draft, label: draft.label.trim() });
    toast.success("شاخص ذخیره شد.");
    onClose();
  }

  return (
    <form onSubmit={submit} noValidate className="flex max-h-[70dvh] flex-col gap-6 overflow-y-auto pe-1">
      <FieldGroup>
        <Field><FieldLabel htmlFor="kpi-label">نام شاخص</FieldLabel><Input id="kpi-label" name="label" autoComplete="off" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field><FieldLabel htmlFor="kpi-unit">واحد</FieldLabel><Input id="kpi-unit" name="unit" autoComplete="off" value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} /></Field>
          <Field data-invalid={targetBad || undefined}><FieldLabel htmlFor="kpi-target">هدف</FieldLabel><Input id="kpi-target" name="target" autoComplete="off" inputMode="decimal" defaultValue={String(draft.target)} aria-invalid={targetBad} onChange={(e) => setDraft({ ...draft, target: e.target.value.trim() === "" ? NaN : Number(e.target.value) })} /></Field>
          <Field><FieldLabel htmlFor="kpi-better">جهت خوب</FieldLabel>
            <Select items={betterItems} value={draft.better} onValueChange={(v) => v && setDraft({ ...draft, better: v as AreaKpi["better"] })}>
              <SelectTrigger id="kpi-better" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{betterItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field><FieldLabel htmlFor="kpi-conn">اتصال</FieldLabel>
            <Select items={connectionItems} value={source.connection} onValueChange={(v) => v && setSource({ connection: v, tool: tools[v][0] })}>
              <SelectTrigger id="kpi-conn" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{connectionItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </Field>
          <Field><FieldLabel htmlFor="kpi-tool">ابزار اتصال</FieldLabel>
            <Select items={toolItems} value={source.tool} onValueChange={(v) => v && setSource({ tool: v })}>
              <SelectTrigger id="kpi-tool" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{toolItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </Field>
        </div>
        <Field>
          <FieldLabel>مقدارهایی که از ابزار خوانده می‌شود</FieldLabel>
          <KpiVariablesEditor variables={source.variables} onChange={(variables) => setSource({ variables })} />
          <FieldDescription>هر مقدار یک نام کوتاه دارد؛ عدد کنار آن آخرین مقدار خوانده‌شده است.</FieldDescription>
        </Field>
        <Field data-invalid={!result.ok || undefined}>
          <FieldLabel htmlFor="kpi-formula">فرمول محاسبه</FieldLabel>
          <Input id="kpi-formula" name="formula" autoComplete="off" spellCheck={false} dir="ltr" className="text-start font-mono" value={source.formula} aria-invalid={!result.ok} onChange={(e) => setSource({ formula: e.target.value })} />
          {result.ok
            ? <FieldDescription>نتیجه‌ی همین حالا: <strong className="tabular-nums text-foreground">{result.value.toLocaleString("fa-IR")} {draft.unit}</strong>. با نام مقدارها، عدد، + - * / و پرانتز بنویسید.</FieldDescription>
            : <FieldError>{result.error}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="kpi-refresh">هر چند دقیقه خوانده شود؟</FieldLabel>
          <Input id="kpi-refresh" name="refreshMinutes" autoComplete="off" inputMode="numeric" defaultValue={String(source.refreshMinutes)} onChange={(e) => setSource({ refreshMinutes: Math.max(1, Math.round(Number(e.target.value)) || source.refreshMinutes) })} />
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="submit" disabled={!result.ok}>ذخیره</Button>
        <Button type="button" variant="outline" loading={testing} onClick={test}>خواندن آزمایشی</Button>
        <Button type="button" variant="ghost" onClick={onClose}>انصراف</Button>
      </DialogFooter>
    </form>
  );
}

type Props = { kpi: AreaKpi | null; onOpenChange: (open: boolean) => void };

/** Edit where a figure comes from (connection and tool), the values read and the formula that makes the figure. */
export function KpiDialog({ kpi, onOpenChange }: Props) {
  return (
    <Dialog open={kpi !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ویرایش شاخص</DialogTitle>
          <DialogDescription>شاخص از یک اتصال سازمان مقدار می‌خواند، با فرمول حساب می‌شود و در نمودار دیده می‌شود.</DialogDescription>
        </DialogHeader>
        {kpi ? <KpiForm key={kpi.id} kpi={kpi} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}
