import { CoinsIcon } from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/format";
import { costByStep, totalTokens } from "../lib/run-cost";
import type { Run } from "../types";

/** Token use of one workflow: totals over its runs, and which steps cost the most. */
export function CostSummary({ runs, quotaLimit }: { runs: Run[]; quotaLimit: number }) {
  const total = totalTokens(runs);
  const steps = costByStep(runs);
  const counted = runs.filter((run) => run.steps.some((step) => step.inputTokens || step.outputTokens)).length;
  const top = steps[0]?.tokens.total ?? 1;

  if (total.total === 0) {
    return <p className="flex items-center gap-2 rounded-xl border p-4 text-body-sm text-muted-foreground"><CoinsIcon className="size-4" aria-hidden />هنوز توکنی مصرف نشده است. بعد از اولین اجرا، هزینه‌ی توکن هر گام اینجا دیده می‌شود.</p>;
  }
  const figures = [
    { label: "جمع توکن‌ها", value: total.total },
    { label: "توکن ورودی", value: total.input },
    { label: "توکن خروجی", value: total.output },
    { label: "میانگین هر اجرا", value: Math.round(total.total / Math.max(counted, 1)) },
  ];
  return (
    <section className="flex flex-col gap-4 rounded-xl border p-4" aria-label="هزینه‌ی توکن">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-2 text-h4"><CoinsIcon className="size-5" aria-hidden />هزینه‌ی توکن</h3>
        <span className="text-body-sm text-muted-foreground">{formatPercent(total.total / quotaLimit)} از سهمیه‌ی شما</span>
      </div>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {figures.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5 rounded-lg bg-muted/40 p-3">
            <dt className="text-caption text-muted-foreground">{item.label}</dt>
            <dd className="text-h4">{formatNumber(item.value)}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-2">
        <h4 className="text-label">سهم هر گام</h4>
        <ul className="flex flex-col gap-2">
          {steps.map((step) => (
            <li key={step.label} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 text-body-sm">
              <span className="truncate">{step.label}{step.modelName ? <span className="text-muted-foreground"> · {step.modelName}</span> : null}</span>
              <span className="h-2 rounded-full bg-muted"><span className="block h-full rounded-full bg-primary" style={{ width: `${(step.tokens.total / top) * 100}%` }} /></span>
              <span className="text-muted-foreground">{formatNumber(step.tokens.total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
