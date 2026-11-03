"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { dayOptions } from "../data/alerts";
import type { ReportSchedule } from "../types";
import { OptionSelect } from "./option-select";

const blank: ReportSchedule = { id: "", name: "", day: "شنبه", time: "08:00", recipients: "", summary: "", enabled: true };

type ReportDialogProps = { open: boolean; report: ReportSchedule | null; onClose: () => void; onSave: (report: ReportSchedule) => void };

/** Creates or edits a scheduled report: when it goes out, to whom and what it covers. */
export function ReportDialog(props: ReportDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={(open) => !open && props.onClose()}>
      <DialogContent>{props.open ? <ReportForm key={props.report?.id ?? "new"} {...props} /> : null}</DialogContent>
    </Dialog>
  );
}

function ReportForm({ report, onClose, onSave }: ReportDialogProps) {
  const [draft, setDraft] = useState<ReportSchedule>(report ?? blank);
  const [tried, setTried] = useState(false);
  const set = (patch: Partial<ReportSchedule>) => setDraft((current) => ({ ...current, ...patch }));
  const missing = !draft.name.trim() || !draft.recipients.trim() || !draft.time;
  const submit = () => {
    setTried(true);
    if (missing) return;
    onSave({ ...draft, name: draft.name.trim(), recipients: draft.recipients.trim(), id: draft.id || `report-${Date.now()}` });
    onClose();
  };
  return (
    <>
      <DialogHeader><DialogTitle>{report ? "ویرایش گزارش" : "گزارش تازه"}</DialogTitle></DialogHeader>
      <FieldGroup>
        <Field data-invalid={tried && !draft.name.trim()}>
          <FieldLabel htmlFor="report-name">نام گزارش</FieldLabel>
          <Input id="report-name" value={draft.name} aria-invalid={tried && !draft.name.trim()} onChange={(event) => set({ name: event.target.value })} />
          {tried && !draft.name.trim() ? <FieldError>نام گزارش را بنویسید.</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="report-day">روز ارسال</FieldLabel>
          <OptionSelect id="report-day" value={draft.day} options={dayOptions.map((day) => ({ value: day, label: day }))} onChange={(day) => set({ day })} />
        </Field>
        <Field data-invalid={tried && !draft.time}>
          <FieldLabel htmlFor="report-time">ساعت ارسال</FieldLabel>
          <Input id="report-time" type="time" dir="ltr" value={draft.time} aria-invalid={tried && !draft.time} onChange={(event) => set({ time: event.target.value })} />
        </Field>
        <Field data-invalid={tried && !draft.recipients.trim()}>
          <FieldLabel htmlFor="report-recipients">گیرندگان</FieldLabel>
          <Input id="report-recipients" value={draft.recipients} placeholder="مثلاً مدیر تولید، مدیر فروش" aria-invalid={tried && !draft.recipients.trim()} onChange={(event) => set({ recipients: event.target.value })} />
          {tried && !draft.recipients.trim() ? <FieldError>دست‌کم یک گیرنده بنویسید.</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="report-summary">محتوا</FieldLabel>
          <Input id="report-summary" value={draft.summary} placeholder="مثلاً فروش، موجودی و ناهنجاری‌های هفته" onChange={(event) => set({ summary: event.target.value })} />
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
        <Button type="button" onClick={submit}>ذخیره</Button>
      </DialogFooter>
    </>
  );
}
