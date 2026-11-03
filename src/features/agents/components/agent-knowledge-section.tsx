"use client";

import { FormSection } from "@/components/shared/form-section";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatNumber } from "@/lib/format";
import { getKnowledgeOptions, modelPolicyLabels, surfaceLabels } from "../data/agent-options";
import type { AgentDraft, AgentSurface, ModelPolicy } from "../types";

type AgentKnowledgeSectionProps = {
  draft: AgentDraft;
  /** Set by the admin: a sensitive Agent always stays on internal models. */
  sensitive: boolean;
  onChange: <K extends keyof AgentDraft>(key: K, value: AgentDraft[K]) => void;
  onPolicyChange: (policy: ModelPolicy) => void;
};

const surfaces: AgentSurface[] = ["assistant", "group", "workflows"];
const policies: ModelPolicy[] = ["internal-only", "auto"];

function toggle<T>(list: T[], item: T, on: boolean): T[] {
  return on ? [...list.filter((value) => value !== item), item] : list.filter((value) => value !== item);
}

/** What the Agent knows, which models it may use, and where people can call it. */
export function AgentKnowledgeSection({ draft, sensitive, onChange, onPolicyChange }: AgentKnowledgeSectionProps) {
  const knowledge = draft.knowledgeIds ?? [];
  const runIn = draft.runIn ?? [];
  const policy: ModelPolicy = sensitive ? "internal-only" : (draft.modelPolicy ?? "auto");

  return (
    <FormSection title="دانش، مدل و محل اجرا" description="Agent فقط از دانشی پاسخ می‌دهد که انتخاب می‌کنید و دسترسی‌اش هرگز از دسترسی شما بیشتر نیست.">
      <fieldset className="flex flex-col gap-2 md:col-span-2">
        <legend className="mb-2 text-label">دانش</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {getKnowledgeOptions().map((item) => {
            const id = `knowledge-${item.id}`;
            return (
              <div key={item.id} className="flex items-start gap-2 rounded-lg border p-3">
                <Checkbox id={id} checked={knowledge.includes(item.id)} onCheckedChange={(checked) => onChange("knowledgeIds", toggle(knowledge, item.id, checked === true))} />
                <Label htmlFor={id} className="flex flex-col items-start gap-0.5">
                  <span>{item.name}</span>
                  <span className="text-caption font-normal text-muted-foreground">{item.source} · {formatNumber(item.documents)} سند</span>
                </Label>
              </div>
            );
          })}
        </div>
        <FieldDescription>{knowledge.length ? `${formatNumber(knowledge.length)} مجموعه انتخاب شده است.` : "بدون دانش، Agent فقط از دستورالعمل و ابزارها پاسخ می‌دهد."}</FieldDescription>
      </fieldset>
      <Field>
        <p className="text-label" id="agent-policy-label">سیاست مدل</p>
        <RadioGroup value={policy} onValueChange={(value) => onPolicyChange(value as ModelPolicy)} aria-labelledby="agent-policy-label" disabled={sensitive}>
          {policies.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <RadioGroupItem id={`policy-${item}`} value={item} className="mt-1" />
              <Label htmlFor={`policy-${item}`} className="flex flex-col items-start gap-0.5">
                <span>{item === "internal-only" ? "🔒 " : "🌐 "}{modelPolicyLabels[item].label}</span>
                <span className="text-caption font-normal text-muted-foreground">{modelPolicyLabels[item].hint}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        {sensitive ? <FieldDescription>این Agent حساس است و ادمین آن را روی «فقط مدل داخلی» گذاشته است.</FieldDescription> : null}
      </Field>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-label">اجرا در</legend>
        {surfaces.map((item) => (
          <div key={item} className="flex items-center gap-2">
            <Checkbox id={`surface-${item}`} checked={runIn.includes(item)} onCheckedChange={(checked) => onChange("runIn", toggle(runIn, item, checked === true))} />
            <Label htmlFor={`surface-${item}`}>{surfaceLabels[item]}</Label>
          </div>
        ))}
        <FieldDescription>در گروه‌های کاریز همکاران با @نام Agent صدایش می‌زنند؛ در جریان‌ها به‌صورت یک گام می‌آید.</FieldDescription>
      </fieldset>
    </FormSection>
  );
}
