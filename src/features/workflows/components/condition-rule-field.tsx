"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConnections } from "@/features/connections/components/connections-provider";
import { conditionSources, operatorLabels } from "../lib/condition-sources";
import type { WorkflowDraft } from "../hooks/use-workflow-draft";
import type { ConditionOperator, ConditionRule, WorkflowNode } from "../types";

/** A condition compares a number from an earlier tool step; without such a step it stays a plain question. */
export function ConditionRuleField({ node, draft }: { node: WorkflowNode; draft: WorkflowDraft }) {
  const { available } = useConnections();
  const sources = conditionSources(node.id, draft.draft.nodes, draft.draft.edges, available);
  const set = (change: Partial<NodeConfigLike>) => draft.updateNode(node.id, { config: change });
  if (sources.length === 0) {
    return (
      <Field>
        <FieldLabel htmlFor="node-condition">پرسش شرط</FieldLabel>
        <Input id="node-condition" value={node.config.condition ?? ""} onChange={(event) => set({ condition: event.target.value })} placeholder="مثلاً: مبلغ بیشتر از ۱۰ میلیون است؟" />
        <FieldDescription>برای شرط عددی، پیش از این گام یک ابزار بگذارید که عدد برگرداند (مثلاً خواندن مقدار حسگر). مسیر «بله» و «خیر» با دو خط از این گام ساخته می‌شود.</FieldDescription>
      </Field>
    );
  }
  const rule: ConditionRule = node.config.rule ?? { sourceNodeId: sources[0].node.id, field: sources[0].outputs[0].key, operator: ">", value: "" };
  const source = sources.find((item) => item.node.id === rule.sourceNodeId) ?? sources[0];
  const apply = (change: Partial<ConditionRule>) => {
    const next = { ...rule, ...change };
    set({ rule: next, condition: describe(next, sources) });
  };
  const sourceItems = sources.map((item) => ({ value: item.node.id, label: item.node.label }));
  const fieldItems = source.outputs.map((output) => ({ value: output.key, label: output.label }));
  const operatorItems = (Object.keys(operatorLabels) as ConditionOperator[]).map((value) => ({ value, label: operatorLabels[value] }));
  const unit = source.outputs.find((output) => output.key === rule.field)?.unit;
  return (
    <div className="flex flex-col gap-3">
      <Field>
        <FieldLabel htmlFor="rule-source">مقدار از کدام گام؟</FieldLabel>
        <Select items={sourceItems} value={source.node.id} onValueChange={(value) => { const found = sources.find((item) => item.node.id === value); if (found) apply({ sourceNodeId: found.node.id, field: found.outputs[0].key }); }}>
          <SelectTrigger id="rule-source"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{sourceItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="rule-field">کدام مقدار؟</FieldLabel>
        <Select items={fieldItems} value={rule.field} onValueChange={(value) => value && apply({ sourceNodeId: source.node.id, field: value })}>
          <SelectTrigger id="rule-field"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{fieldItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="rule-operator">شرط</FieldLabel>
          <Select items={operatorItems} value={rule.operator} onValueChange={(value) => value && apply({ sourceNodeId: source.node.id, field: rule.field, operator: value as ConditionOperator })}>
            <SelectTrigger id="rule-operator"><SelectValue /></SelectTrigger>
            <SelectContent><SelectGroup>{operatorItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="rule-value">عدد{unit ? ` (${unit})` : ""}</FieldLabel>
          <Input id="rule-value" inputMode="decimal" value={rule.value} onChange={(event) => apply({ sourceNodeId: source.node.id, field: rule.field, value: event.target.value })} />
        </Field>
      </div>
      <FieldDescription>اگر شرط برقرار باشد مسیر «بله» ادامه پیدا می‌کند، وگرنه «خیر».</FieldDescription>
    </div>
  );
}

type NodeConfigLike = Partial<Pick<WorkflowNode["config"], "rule" | "condition">>;

function describe(rule: ConditionRule, sources: ReturnType<typeof conditionSources>): string {
  const source = sources.find((item) => item.node.id === rule.sourceNodeId);
  const output = source?.outputs.find((item) => item.key === rule.field);
  return `${output?.label ?? rule.field} ${operatorLabels[rule.operator]} ${rule.value}${output?.unit ? ` ${output.unit}` : ""}`.trim();
}
