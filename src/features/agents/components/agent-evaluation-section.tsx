"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2Icon, ChevronDownIcon, CircleXIcon, PlayIcon } from "lucide-react";
import { toast } from "sonner";
import { FormSection } from "@/components/shared/form-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/format";
import { evalMisses, getEvalSet } from "../data/agent-options";
import { formatScore, formatVersion } from "../lib/version";

type AgentEvaluationSectionProps = {
  /** Saved version; a new Agent has none until it is saved. */
  version?: string;
  score?: number;
  onScore: (score: number) => void;
};

/** Version of the Agent and its evaluation set: sample questions with the expected answers. */
export function AgentEvaluationSection({ version, score, onScore }: AgentEvaluationSectionProps) {
  const cases = getEvalSet();
  const [showCases, setShowCases] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  function run() {
    if (timer.current) clearInterval(timer.current);
    let count = 0;
    setFinished(false);
    setDone(0);
    timer.current = setInterval(() => {
      count += 1;
      setDone(count);
      if (count < cases.length) return;
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
      const right = cases.length - Object.keys(evalMisses).length;
      setFinished(true);
      onScore(right / cases.length);
      toast.success(`ارزیابی اجرا شد: ${formatNumber(right)} از ${formatNumber(cases.length)} درست`);
    }, 140);
  }

  const running = done !== null && !finished;
  const correct = cases.length - Object.keys(evalMisses).length;

  return (
    <FormSection title="نسخه و ارزیابی" description="هر ذخیره یک نسخه‌ی تازه می‌سازد. پیش از ارسال برای تأیید، Agent را با مجموعه‌ی ارزیابی بسنجید.">
      <div className="flex flex-wrap items-center gap-2 md:col-span-2">
        <Badge variant="outline">{version ? `نسخه ${formatVersion(version)}` : "نسخه ۱.۰ پس از ذخیره"}</Badge>
        <Badge variant="secondary">مجموعه ارزیابی: {formatNumber(cases.length)} نمونه</Badge>
        {score !== undefined ? <Badge variant={score >= 0.9 ? "success" : "warning"}>آخرین نتیجه {formatScore(score)}</Badge> : <Badge variant="outline">هنوز ارزیابی نشده</Badge>}
      </div>
      <div className="flex flex-col gap-3 md:col-span-2">
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="soft" onClick={run} loading={running}><PlayIcon aria-hidden />✦ اجرای ارزیابی</Button>
          <Button type="button" variant="ghost" aria-expanded={showCases} onClick={() => setShowCases((value) => !value)}>
            <ChevronDownIcon aria-hidden className={showCases ? "rotate-180 transition-transform" : "transition-transform"} />
            {showCases ? "پنهان کردن نمونه‌ها" : "نمایش پرسش‌ها و پاسخ‌های مورد انتظار"}
          </Button>
        </div>
        {done !== null ? (
          <div className="flex flex-col gap-2" aria-live="polite">
            <Progress value={(done / cases.length) * 100} aria-label="پیشرفت ارزیابی" />
            <span className="text-caption text-muted-foreground">{finished ? "ارزیابی تمام شد." : `در حال پرسیدن نمونه‌ی ${formatNumber(Math.min(done + 1, cases.length))} از ${formatNumber(cases.length)}…`}</span>
          </div>
        ) : null}
        {finished ? (
          <Alert variant="success">
            <CheckCircle2Icon aria-hidden />
            <AlertTitle>{formatNumber(correct)} از {formatNumber(cases.length)} درست · {formatScore(correct / cases.length)}</AlertTitle>
            <AlertDescription>
              <ul className="flex flex-col gap-1">
                {cases.filter((item) => evalMisses[item.id]).map((item) => (
                  <li key={item.id} className="flex gap-2"><CircleXIcon className="mt-1 size-4 shrink-0 text-destructive" aria-hidden /><span>«{item.question}» — پاسخ Agent: {evalMisses[item.id]}</span></li>
                ))}
              </ul>
              <span className="mt-1 block">نتیجه با ذخیره‌ی Agent روی کارت آن ثبت می‌شود.</span>
            </AlertDescription>
          </Alert>
        ) : null}
        {showCases ? (
          <ol className="flex max-h-80 flex-col divide-y overflow-y-auto rounded-lg border">
            {cases.map((item, index) => (
              <li key={item.id} className="flex flex-col gap-0.5 p-3 text-body-sm">
                <span className="text-label">{formatNumber(index + 1)}. {item.question}</span>
                <span className="text-muted-foreground">پاسخ مورد انتظار: {item.expected}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </FormSection>
  );
}
