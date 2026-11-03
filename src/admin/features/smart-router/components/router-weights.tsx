"use client";

import { defaultWeights, weightLabels, type RouterWeights, type SmartRouter } from "@/lib/smart-routing";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/admin/lib/format";

const keys = Object.keys(weightLabels) as (keyof RouterWeights)[];

const hints: Record<keyof RouterWeights, string> = {
  quality: "امتیاز ناظر روی مجموعه‌ی ارزیابی سازمان",
  speed: "توکن در ثانیه",
  cost: "هزینه‌ی تخمینی هر پاسخ",
};

type Props = { router: SmartRouter; onChange: (weights: RouterWeights) => void };

/** Three sliders; the share of each criterion is shown as a percent of the total. */
export function RouterWeightsEditor({ router, onChange }: Props) {
  const weights = router.weights ?? defaultWeights;
  const total = weights.quality + weights.speed + weights.cost || 1;
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border p-4">
      <div className="grid gap-4 md:grid-cols-3">
        {keys.map((key) => (
          <div key={key} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={`weight-${key}`} className="text-label">{weightLabels[key]}</label>
              <span className="text-body-sm tabular-nums text-muted-foreground">{formatNumber(Math.round((weights[key] / total) * 100))}٪ از تصمیم</span>
            </div>
            <input
              id={`weight-${key}`}
              type="range"
              min={0}
              max={100}
              step={5}
              value={weights[key]}
              aria-valuetext={`${formatNumber(weights[key])} از ۱۰۰`}
              onChange={(event) => onChange({ ...weights, [key]: Number(event.target.value) })}
              className="h-2 w-full cursor-pointer accent-primary"
            />
            <span className="text-caption text-muted-foreground">{hints[key]}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-body-sm text-muted-foreground">آماده:</span>
        <Button size="xs" variant="outline" onClick={() => onChange({ quality: 70, speed: 15, cost: 15 })}>کیفیت اول</Button>
        <Button size="xs" variant="outline" onClick={() => onChange({ quality: 30, speed: 50, cost: 20 })}>سرعت اول</Button>
        <Button size="xs" variant="outline" onClick={() => onChange({ quality: 25, speed: 15, cost: 60 })}>صرفه‌جویی</Button>
        <Button size="xs" variant="ghost" onClick={() => onChange(defaultWeights)}>پیش‌فرض</Button>
      </div>
    </div>
  );
}
