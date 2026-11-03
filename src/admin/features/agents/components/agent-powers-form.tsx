"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getDataSourceLevels, getPolicyModels } from "@/admin/features/policies/data/policy-models";
import { sensitivityLabels } from "@/admin/features/policies/types";
import { formatNumber } from "@/admin/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { internalModelIds } from "../data/org-agents";
import type { AgentPatch, OrgAgent, ToolPolicy } from "../types";

const models = getPolicyModels();
const sources = getDataSourceLevels();
const modeItems = [
  { value: "read", label: "فقط‌خواندنی" },
  { value: "readwrite", label: "خواندن‌ونوشتن" },
];
const toggle = (list: string[], id: string, on: boolean) => (on ? [...new Set([...list, id])] : list.filter((x) => x !== id));

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-label">{title}</h3>
        {hint ? <p className="text-caption text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** Sensitivity, models, tools (read or read-write), data and the write-action limit of one Agent. */
export function AgentPowersForm({ agent, onSave }: { agent: OrgAgent; onSave: (patch: AgentPatch) => void }) {
  const [draft, setDraft] = useState<AgentPatch>({ sensitive: agent.sensitive, tools: agent.tools, dataIds: agent.dataIds, modelIds: agent.modelIds, writeLimit: agent.writeLimit });
  const set = (patch: Partial<AgentPatch>) => setDraft((d) => ({ ...d, ...patch }));
  const setTool = (key: string, patch: Partial<ToolPolicy>) => set({ tools: draft.tools.map((t) => (t.key === key ? { ...t, ...patch } : t)) });

  return (
    <div className="flex flex-col gap-6">
      <Field orientation="horizontal" className="rounded-lg border border-border p-3">
        <Switch
          id="agent-sensitive"
          checked={draft.sensitive}
          onCheckedChange={(on) => set({ sensitive: on, modelIds: on ? draft.modelIds.filter((id) => internalModelIds.includes(id)) : draft.modelIds })}
        />
        <div className="flex flex-col gap-0.5">
          <FieldLabel htmlFor="agent-sensitive">حساس</FieldLabel>
          <FieldDescription>عامل حساس فقط با مدل‌های داخلی کار می‌کند؛ کاربر و سازنده نمی‌توانند این را تغییر دهند.</FieldDescription>
        </div>
      </Field>

      <Section title="مدل‌های مجاز">
        <ul className="grid gap-2 sm:grid-cols-2">
          {models.map((m) => {
            const blocked = (draft.sensitive && m.location === "external") || !m.enabled;
            return (
              <li key={m.id}>
                <Field orientation="horizontal">
                  <Checkbox id={`model-${m.id}`} checked={!blocked && draft.modelIds.includes(m.id)} disabled={blocked} onCheckedChange={(c) => set({ modelIds: toggle(draft.modelIds, m.id, Boolean(c)) })} />
                  <FieldLabel htmlFor={`model-${m.id}`}>
                    <bdi dir="ltr">{m.name}</bdi>
                    <span className="text-caption text-muted-foreground">{m.location === "internal" ? "داخلی" : m.enabled ? "بیرونی" : "غیرفعال در سازمان"}</span>
                  </FieldLabel>
                </Field>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="ابزارهای مجاز" hint="ابزاری که فقط می‌خواند همیشه فقط‌خواندنی است.">
        {draft.tools.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">این عامل ابزاری ندارد.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
            {draft.tools.map((t) => (
              <li key={t.key} className="flex flex-wrap items-center justify-between gap-3 p-3">
                <span className="flex items-center gap-3">
                  <Switch checked={t.enabled} onCheckedChange={(on) => setTool(t.key, { enabled: on })} aria-label={`ابزار ${t.name} مجاز باشد`} />
                  <span className="flex flex-col">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-caption text-muted-foreground">{t.connection}</span>
                  </span>
                </span>
                <Select items={modeItems} value={t.mode} disabled={!t.canWrite || !t.enabled} onValueChange={(v) => v && setTool(t.key, { mode: v as ToolPolicy["mode"] })}>
                  <SelectTrigger size="sm" className="w-36" aria-label={`نوع دسترسی ${t.name}`}><SelectValue /></SelectTrigger>
                  <SelectContent><SelectGroup>{modeItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="داده‌های مجاز" hint="داده‌ی محرمانه فقط با مدل داخلی پردازش می‌شود.">
        <ul className="grid gap-2 sm:grid-cols-2">
          {sources.map((s) => (
            <li key={s.id}>
              <Field orientation="horizontal">
                <Checkbox id={`data-${s.id}`} checked={draft.dataIds.includes(s.id)} onCheckedChange={(c) => set({ dataIds: toggle(draft.dataIds, s.id, Boolean(c)) })} />
                <FieldLabel htmlFor={`data-${s.id}`}>
                  {s.name}
                  {s.level === "confidential" ? <Badge variant="warning">{sensitivityLabels[s.level]}</Badge> : null}
                </FieldLabel>
              </Field>
            </li>
          ))}
        </ul>
      </Section>

      {draft.writeLimit ? (
        <Section title="حد اقدام نوشتنی" hint="بیش از این حد، اقدام فقط با تأیید انسانی انجام می‌شود.">
          <Field>
            <FieldLabel htmlFor="agent-limit">{draft.writeLimit.label} ({draft.writeLimit.unit})</FieldLabel>
            <Input
              id="agent-limit"
              inputMode="numeric"
              dir="ltr"
              className="text-start sm:w-64"
              value={draft.writeLimit.amount ?? ""}
              placeholder="بدون سقف"
              onChange={(e) => {
                const amount = Number(e.target.value.replace(/[^\d]/g, ""));
                set({ writeLimit: { ...draft.writeLimit!, amount: e.target.value.trim() ? amount : null } });
              }}
            />
            <FieldDescription>
              {draft.writeLimit.amount ? `${formatNumber(draft.writeLimit.amount)} ${draft.writeLimit.unit}` : "بدون سقف؛ پیشنهاد می‌شود سقف تعیین کنید."}
            </FieldDescription>
          </Field>
        </Section>
      ) : null}

      <div>
        <Button
          onClick={() => {
            onSave(draft);
            toast.success(`اختیارات «${agent.name}» به‌روز شد.`);
          }}
        >
          ذخیره‌ی اختیارات
        </Button>
      </div>
    </div>
  );
}
