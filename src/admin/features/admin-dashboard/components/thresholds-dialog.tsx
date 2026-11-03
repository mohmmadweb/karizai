"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/admin/lib/format";
import { toThresholds, validateThresholds, type ThresholdErrors, type ThresholdText } from "../lib/validation";
import type { Thresholds } from "../types";

type Props = {
  open: boolean;
  thresholds: Thresholds;
  onOpenChange: (open: boolean) => void;
  onSave: (thresholds: Thresholds) => void;
};

const fields: { key: keyof Thresholds; label: string; hint: string }[] = [
  { key: "ttftP95Sec", label: "آستانه‌ی تأخیر صدک ۹۵ زمان تا اولین کلمه (ثانیه)", hint: "پیش‌فرض ۵ ثانیه" },
  { key: "e2eP95Sec", label: "آستانه‌ی زمان کامل درخواست (ثانیه)", hint: "پیش‌فرض ۳۰ ثانیه" },
  { key: "errorRatePercent", label: "آستانه‌ی نرخ خطا (درصد)", hint: "پیش‌فرض ۵٪" },
];

const toText = (t: Thresholds): ThresholdText => ({
  ttftP95Sec: formatNumber(t.ttftP95Sec, { useGrouping: false }),
  e2eP95Sec: formatNumber(t.e2eP95Sec, { useGrouping: false }),
  errorRatePercent: formatNumber(t.errorRatePercent, { useGrouping: false }),
});

function ThresholdsForm({ thresholds, onSave, onClose }: Omit<Props, "open" | "onOpenChange"> & { onClose: () => void }) {
  const [text, setText] = useState<ThresholdText>(() => toText(thresholds));
  const [errors, setErrors] = useState<ThresholdErrors>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validateThresholds(text);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave(toThresholds(text));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {fields.map((f) => (
        <Field key={f.key} data-invalid={errors[f.key] ? true : undefined}>
          <FieldLabel htmlFor={`threshold-${f.key}`}>{f.label}</FieldLabel>
          <Input
            id={`threshold-${f.key}`}
            inputMode="decimal"
            value={text[f.key]}
            aria-invalid={errors[f.key] ? true : undefined}
            onChange={(e) => setText({ ...text, [f.key]: e.target.value })}
          />
          <FieldDescription>{f.hint}</FieldDescription>
          <FieldError>{errors[f.key]}</FieldError>
        </Field>
      ))}
      <DialogFooter>
        <Button type="submit">ذخیره</Button>
        <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
      </DialogFooter>
    </form>
  );
}

export function ThresholdsDialog({ open, thresholds, onOpenChange, onSave }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تنظیم آستانه‌ها</DialogTitle>
          <DialogDescription>با گذشتن از این آستانه‌ها هشدار ساخته می‌شود. تغییر تا بارگذاری دوباره‌ی صفحه می‌ماند.</DialogDescription>
        </DialogHeader>
        <ThresholdsForm thresholds={thresholds} onSave={onSave} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
