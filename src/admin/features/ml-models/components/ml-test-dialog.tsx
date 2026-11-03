"use client";

import { useState } from "react";
import { PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/admin/lib/format";
import { simulateRequest } from "@/lib/simulate-request";
import { runMlModel, type MlModel } from "../data/ml-models";

type Props = { model: MlModel | null; onOpenChange: (open: boolean) => void };

/** Sends a sample input to the model (simulated) and shows the output fields. */
export function MlTestDialog({ model, onOpenChange }: Props) {
  return (
    <Dialog open={model !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">{model ? <TestForm key={model.id} model={model} /> : null}</DialogContent>
    </Dialog>
  );
}

function TestForm({ model }: { model: MlModel }) {
  const [values, setValues] = useState(() => Object.fromEntries(model.input.map((f) => [f.name, f.sample])));
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<Record<string, number> | null>(null);
  async function run() {
    setRunning(true);
    setOutput(null);
    await simulateRequest(700);
    setOutput(runMlModel(model.id, values));
    setRunning(false);
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>آزمون «{model.name}»</DialogTitle>
        <DialogDescription><bdi dir="ltr">POST {model.endpoint}</bdi></DialogDescription>
      </DialogHeader>
      <form noValidate onSubmit={(e) => { e.preventDefault(); void run(); }} className="grid gap-3 sm:grid-cols-2">
        {model.input.map((f) => (
          <Field key={f.name}>
            <FieldLabel htmlFor={`ml-${f.name}`}>{f.label}</FieldLabel>
            <Input id={`ml-${f.name}`} dir="ltr" value={values[f.name] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} />
          </Field>
        ))}
        <div className="sm:col-span-2"><Button type="submit" loading={running}><PlayIcon aria-hidden />اجرا</Button></div>
      </form>
      {output ? (
        <dl role="status" className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/40 p-4">
          {model.output.map((f) => (
            <div key={f.name} className="flex flex-col gap-0.5">
              <dt className="text-caption text-muted-foreground">{f.label} <bdi dir="ltr">({f.name})</bdi></dt>
              <dd className="text-h4 tabular-nums">{formatNumber(output[f.name] ?? 0, { maximumFractionDigits: 2 })}</dd>
            </div>
          ))}
          <p className="col-span-2 text-caption text-muted-foreground">پاسخ در ۷۰۰ میلی‌ثانیه؛ این خروجی عددی در شرط جریان‌ها قابل استفاده است.</p>
        </dl>
      ) : null}
    </>
  );
}
