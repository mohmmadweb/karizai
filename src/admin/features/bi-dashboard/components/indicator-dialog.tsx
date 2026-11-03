"use client";

import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { emptyForm, formFrom, toInput, type IndicatorFormValues } from "../lib/form";
import { validateIndicator } from "../lib/validation";
import type { Indicator, IndicatorErrors } from "../types";
import { useBi } from "./bi-provider";
import { IndicatorFields } from "./indicator-fields";

function IndicatorForm({ indicator, onClose }: { indicator: Indicator | null; onClose: () => void }) {
  const { indicators, addIndicator, updateIndicator } = useBi();
  const [values, setValues] = useState<IndicatorFormValues>(indicator ? formFrom(indicator) : emptyForm);
  const [errors, setErrors] = useState<IndicatorErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const input = toInput(values);
    const found = validateIndicator(input, indicators.filter((item) => item.id !== indicator?.id));
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the first field with a problem.
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }
    if (indicator) updateIndicator(indicator.id, input);
    else addIndicator(input);
    toast.success(indicator ? "تغییرها ذخیره شد." : "شاخص ساخته شد.");
    onClose();
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex max-h-[70dvh] flex-col gap-6 overflow-y-auto pe-1">
      <FieldGroup><IndicatorFields values={values} errors={errors} onChange={setValues} /></FieldGroup>
      <DialogFooter>
        <Button type="submit">{indicator ? "ذخیره" : "ساخت"}</Button>
        <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
      </DialogFooter>
    </form>
  );
}

type Props = { open: boolean; indicator: Indicator | null; onOpenChange: (open: boolean) => void };

/** Create or edit an indicator. The form starts fresh every time it opens. */
export function IndicatorDialog({ open, indicator, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{indicator ? "ویرایش شاخص" : "شاخص تازه"}</DialogTitle>
          <DialogDescription>شاخص، حد مجازش، منبع مقدار و مسئولانی که هنگام خروج از حد باید خبردار شوند.</DialogDescription>
        </DialogHeader>
        {open ? <IndicatorForm key={indicator?.id ?? "new"} indicator={indicator} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}
