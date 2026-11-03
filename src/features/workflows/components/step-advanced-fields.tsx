"use client";

import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAgents } from "@/features/agents/components/agents-provider";
import { formatNumber } from "@/lib/format";
import { getMlModel, getMlModels, sampleCode } from "../data/ml-models";
import type { WorkflowDraft } from "../hooks/use-workflow-draft";
import { upstreamOf } from "../lib/graph";
import type { CodeLanguage, NodeConfig, NodeKind, OnError, WorkflowNode } from "../types";

function PlainSelect({ id, items, value, onChange }: { id: string; items: { value: string; label: string }[]; value: string; onChange: (value: string) => void }) {
  return (
    <Select items={items} value={value} onValueChange={(next) => next && onChange(String(next))}>
      <SelectTrigger id={id}><SelectValue /></SelectTrigger>
      <SelectContent><SelectGroup>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
    </Select>
  );
}

/** Settings of the code, ML model, router and supervisor steps. */
export function StepKindFields({ node, draft }: { node: WorkflowNode; draft: WorkflowDraft }) {
  const { agents } = useAgents();
  const c = node.config;
  const set = (config: NodeConfig) => draft.updateNode(node.id, { config });
  if (node.kind === "code") {
    const language: CodeLanguage = c.language ?? "python";
    return (
      <>
        <Field>
          <FieldLabel htmlFor="node-language">زبان</FieldLabel>
          <PlainSelect id="node-language" items={[{ value: "python", label: "Python" }, { value: "javascript", label: "JavaScript" }]} value={language} onChange={(value) => set({ language: value as CodeLanguage, code: c.code === sampleCode[language] || !c.code ? sampleCode[value as CodeLanguage] : c.code })} />
        </Field>
        <Field>
          <FieldLabel htmlFor="node-code">کد</FieldLabel>
          <Textarea id="node-code" dir="ltr" rows={8} spellCheck={false} className="font-mono text-caption" value={c.code ?? ""} onChange={(event) => set({ code: event.target.value })} />
          <FieldDescription>در محیط ایزوله اجرا می‌شود؛ خروجی گام قبل در <bdi dir="ltr">data</bdi> است و به اینترنت دسترسی ندارد.</FieldDescription>
        </Field>
      </>
    );
  }
  if (node.kind === "ml-model") {
    const model = getMlModel(c.mlModelId);
    return (
      <Field>
        <FieldLabel htmlFor="node-ml">مدل ثبت‌شده</FieldLabel>
        <PlainSelect id="node-ml" items={getMlModels().map((item) => ({ value: item.id, label: item.name }))} value={c.mlModelId ?? ""} onChange={(value) => set({ mlModelId: value })} />
        {model ? (
          <FieldDescription>
            {model.description} نشانی: <bdi dir="ltr" className="break-all">{model.endpoint}</bdi>. خروجی‌های عددی ({model.outputs.map((item) => item.label).join("، ")}) در گام «شرط» بعدی قابل مقایسه‌اند.
          </FieldDescription>
        ) : null}
      </Field>
    );
  }
  if (node.kind === "router") {
    const items = agents.filter((a) => a.isEnabled).map((a) => ({ value: a.id, label: a.name, hint: a.purpose }));
    return (
      <Field>
        <FieldLabel htmlFor="node-routes">Agentهایی که مسیریاب از میانشان انتخاب می‌کند</FieldLabel>
        <SearchableMultiSelect id="node-routes" items={items} value={c.childAgentIds ?? []} onValueChange={(ids) => set({ childAgentIds: ids })} placeholder="انتخاب Agentها" searchPlaceholder="جست‌وجوی Agent" emptyText="Agentی پیدا نشد" />
        <FieldDescription>برای هر درخواست، مناسب‌ترین Agent و مدل (داخلی برای داده‌ی حساس) انتخاب می‌شود.</FieldDescription>
      </Field>
    );
  }
  if (node.kind === "supervisor") {
    return (
      <Field>
        <FieldLabel htmlFor="node-checks">معیارهای ناظر (هر خط یک معیار)</FieldLabel>
        <Textarea id="node-checks" rows={4} value={(c.checks ?? []).join("\n")} onChange={(event) => set({ checks: event.target.value.split("\n") })} />
        <FieldDescription>اگر خروجی یکی از معیارها را نداشته باشد، ناظر آن را برای اصلاح برمی‌گرداند.</FieldDescription>
      </Field>
    );
  }
  if (node.kind === "fork" || node.kind === "join") {
    return <p className="rounded-lg bg-muted p-3 text-body-sm text-muted-foreground">{node.kind === "fork" ? "هر مسیری که از این گام بیرون می‌رود هم‌زمان با بقیه اجرا می‌شود. با «پیوستن شاخه‌ها» منتظر ماندن برای همه را مشخص کنید." : "این گام صبر می‌کند تا همه‌ی شاخه‌هایی که به آن می‌رسند تمام شوند."}</p>;
  }
  return null;
}

const workingKinds: NodeKind[] = ["agent", "skill", "tool", "orchestrator", "code", "ml-model", "prompt-optimizer", "router", "supervisor"];

/** Retries, timeout and what happens on failure, for every step that does work. */
export function StepErrorSettings({ node, draft }: { node: WorkflowNode; draft: WorkflowDraft }) {
  if (!workingKinds.includes(node.kind)) return null;
  const c = node.config;
  const set = (config: NodeConfig) => draft.updateNode(node.id, { config });
  const policy: OnError = c.onError ?? "stop";
  const errorEdge = draft.draft.edges.find((edge) => edge.source === node.id && edge.label === "خطا");
  const before = upstreamOf(node.id, draft.draft.edges);
  const targets = draft.draft.nodes.filter((item) => item.id !== node.id && !before.has(item.id)).map((item) => ({ value: item.id, label: item.label }));
  return (
    <section className="flex flex-col gap-3 rounded-lg border p-3" aria-label="رفتار هنگام خطا">
      <h4 className="text-label">رفتار هنگام خطا</h4>
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="node-retries">تلاش دوباره</FieldLabel>
          <Input id="node-retries" type="number" min={0} max={5} value={c.retries ?? 0} onChange={(event) => set({ retries: Math.max(0, Math.min(5, Number(event.target.value) || 0)) })} />
        </Field>
        <Field>
          <FieldLabel htmlFor="node-timeout">مهلت (ثانیه)</FieldLabel>
          <Input id="node-timeout" type="number" min={5} max={600} value={c.timeoutSec ?? 30} onChange={(event) => set({ timeoutSec: Number(event.target.value) || 30 })} />
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="node-onerror">اگر بعد از {formatNumber(c.retries ?? 0)} تلاش دوباره هم خطا داد</FieldLabel>
        <PlainSelect
          id="node-onerror"
          items={[{ value: "stop", label: "جریان متوقف شود" }, { value: "continue", label: "نادیده بگیرد و ادامه دهد" }, { value: "branch", label: "به مسیر «خطا» برود" }]}
          value={policy}
          onChange={(value) => { set({ onError: value as OnError }); if (value !== "branch") draft.setErrorTarget(node.id, null); }}
        />
      </Field>
      {policy === "branch" ? (
        <Field>
          <FieldLabel htmlFor="node-error-target">گام مسیر «خطا»</FieldLabel>
          <PlainSelect id="node-error-target" items={targets} value={errorEdge?.target ?? ""} onChange={(value) => draft.setErrorTarget(node.id, value)} />
          <FieldDescription>این مسیر با خط‌چین قرمز روی بوم دیده می‌شود و فقط هنگام خطا طی می‌شود.</FieldDescription>
        </Field>
      ) : null}
    </section>
  );
}
