"use client";

import { useState } from "react";
import { PlayIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { OptionSelect } from "@/features/alerts/components/option-select";
import { getCompareTasks } from "../data/tasks";
import { useComparison } from "../hooks/use-comparison";
import { CompareTable } from "./compare-table";

const maxModels = 4;

export function ComparePageContent() {
  const { models } = useModels();
  const tasks = getCompareTasks();
  const available = models.filter((model) => model.isAvailable);
  const [taskId, setTaskId] = useState(tasks[0].id);
  // Until the user chooses, the first three models are picked; the list may still be loading on first render.
  const [picks, setPicks] = useState<string[] | null>(null);
  const chosen = picks ?? available.slice(0, 3).map((model) => model.id);
  const { rows, running, run } = useComparison();
  const task = tasks.find((item) => item.id === taskId) ?? tasks[0];
  const picked = available.filter((model) => chosen.includes(model.id));
  const toggle = (id: string, on: boolean) => setPicks((on ? [...chosen, id].slice(-maxModels) : chosen.filter((item) => item !== id)));

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="مقایسه‌ی مدل‌ها" description="یک کار یکسان را با ورودی و شرایط یکسان روی چند مدل، یک‌بار مستقیم و یک‌بار چندایجنتی اجرا کنید و زمان و هزینه را کنار هم ببینید." />
      <section aria-label="تنظیم مقایسه" className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="compare-task">کار</FieldLabel>
          <OptionSelect id="compare-task" value={taskId} options={tasks.map((item) => ({ value: item.id, label: item.title }))} onChange={setTaskId} />
        </Field>
        <p className="rounded-lg bg-muted px-3 py-2 text-body-sm text-muted-foreground">{task.prompt}</p>
        <fieldset className="flex flex-col gap-2">
          <legend className="text-label">مدل‌ها (تا {formatCount(maxModels)} مدل)</legend>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {available.map((model) => (
              <div key={model.id} className="flex items-center gap-2">
                <Checkbox id={`cmp-${model.id}`} checked={chosen.includes(model.id)} onCheckedChange={(on) => toggle(model.id, Boolean(on))} />
                <Label htmlFor={`cmp-${model.id}`}>{model.name}{model.isInternal ? " (داخلی)" : ""}</Label>
              </div>
            ))}
          </div>
        </fieldset>
        <Button type="button" className="w-fit" disabled={running || picked.length === 0} loading={running} onClick={() => run(picked, task)}><PlayIcon aria-hidden />اجرای مقایسه</Button>
      </section>
      {rows.length > 0 ? <CompareTable rows={rows} /> : <p className="text-body-sm text-muted-foreground">مدل‌ها را انتخاب و مقایسه را اجرا کنید.</p>}
    </div>
  );
}

const formatCount = (value: number) => new Intl.NumberFormat("fa-IR").format(value);
