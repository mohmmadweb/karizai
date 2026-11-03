"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { frequencyLabels, metricOptions, recipientOptions, sensitivityLabels } from "../data/alerts";
import type { AlertRule, Frequency, Sensitivity } from "../types";
import { OptionSelect } from "./option-select";

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));
const fromLabels = (labels: Record<string, string>) => Object.entries(labels).map(([value, label]) => ({ value, label }));
const blank: AlertRule = { id: "", name: "", metric: "", sensitivity: "medium", recipient: "", frequency: "instant", enabled: true };

type RuleDialogProps = { open: boolean; rule: AlertRule | null; onClose: () => void; onSave: (rule: AlertRule) => void };

/** Creates or edits an alert rule: the data, how sensitive it is, who is told and how often. */
export function RuleDialog(props: RuleDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={(open) => !open && props.onClose()}>
      <DialogContent>{props.open ? <RuleForm key={props.rule?.id ?? "new"} {...props} /> : null}</DialogContent>
    </Dialog>
  );
}

function RuleForm({ rule, onClose, onSave }: RuleDialogProps) {
  const [draft, setDraft] = useState<AlertRule>(rule ?? blank);
  const [tried, setTried] = useState(false);
  const set = (patch: Partial<AlertRule>) => setDraft((current) => ({ ...current, ...patch }));
  const missing = !draft.name.trim() || !draft.metric || !draft.recipient;
  const submit = () => {
    setTried(true);
    if (missing) return;
    onSave({ ...draft, name: draft.name.trim(), id: draft.id || `rule-${Date.now()}` });
    onClose();
  };
  return (
    <>
      <DialogHeader><DialogTitle>{rule ? "ویرایش هشدار" : "هشدار تازه"}</DialogTitle></DialogHeader>
      <FieldGroup>
        <Field data-invalid={tried && !draft.name.trim()}>
          <FieldLabel htmlFor="rule-name">نام هشدار</FieldLabel>
          <Input id="rule-name" value={draft.name} aria-invalid={tried && !draft.name.trim()} onChange={(event) => set({ name: event.target.value })} />
          {tried && !draft.name.trim() ? <FieldError>نام هشدار را بنویسید.</FieldError> : null}
        </Field>
        <Field data-invalid={tried && !draft.metric}>
          <FieldLabel htmlFor="rule-metric">داده‌ی زیرنظر</FieldLabel>
          <OptionSelect id="rule-metric" value={draft.metric} options={toOptions(metricOptions)} onChange={(metric) => set({ metric })} />
          {tried && !draft.metric ? <FieldError>یک داده را انتخاب کنید.</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="rule-sensitivity">حساسیت</FieldLabel>
          <OptionSelect id="rule-sensitivity" value={draft.sensitivity} options={fromLabels(sensitivityLabels)} onChange={(value) => set({ sensitivity: value as Sensitivity })} />
        </Field>
        <Field data-invalid={tried && !draft.recipient}>
          <FieldLabel htmlFor="rule-recipient">گیرنده</FieldLabel>
          <OptionSelect id="rule-recipient" value={draft.recipient} options={toOptions(recipientOptions)} onChange={(recipient) => set({ recipient })} />
          {tried && !draft.recipient ? <FieldError>گیرنده را انتخاب کنید.</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="rule-frequency">تناوب ارسال</FieldLabel>
          <OptionSelect id="rule-frequency" value={draft.frequency} options={fromLabels(frequencyLabels)} onChange={(value) => set({ frequency: value as Frequency })} />
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
        <Button type="button" onClick={submit}>ذخیره</Button>
      </DialogFooter>
    </>
  );
}
