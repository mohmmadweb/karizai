"use client";

import { useEffect, useState } from "react";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { buildCases, type EvalRow } from "../data/evaluations";
import { pct, ver } from "./format";

type Props = { row: EvalRow | null; onOpenChange: (open: boolean) => void; onFinish: (row: EvalRow, accuracy: number) => void };

/** Simulated run: cases are checked one by one, then the accuracy decides the release. */
export function RunDialog({ row, onOpenChange, onFinish }: Props) {
  return (
    <Dialog open={row !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        {row ? <Run key={row.id} row={row} onFinish={onFinish} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function Run({ row, onFinish, onClose }: { row: EvalRow; onFinish: Props["onFinish"]; onClose: () => void }) {
  const target = row.candidate ?? { version: row.version, change: "اجرای دوباره روی نسخه‌ی فعلی", passRate: row.accuracy };
  const [cases] = useState(() => buildCases(row, target.passRate));
  const [done, setDone] = useState(0);
  const finished = done >= cases.length;
  const passed = cases.slice(0, done).filter((c) => c.pass).length;
  const accuracy = passed / cases.length;
  const blocked = finished && Boolean(row.candidate) && accuracy < row.accuracy;

  useEffect(() => {
    if (finished) return;
    const timer = setTimeout(() => setDone((d) => d + 1), 180);
    return () => clearTimeout(timer);
  }, [done, finished]);

  useEffect(() => {
    if (finished) onFinish(row, accuracy);
    // Report once, when the last case is checked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>✦ ارزیابی {row.agent} · نسخه‌ی {ver(target.version)}</DialogTitle>
        <DialogDescription>{target.change} · {cases.length.toLocaleString("fa-IR")} نمونه</DialogDescription>
      </DialogHeader>
      <Progress value={(done / cases.length) * 100} aria-label="پیشرفت ارزیابی" />
      <p className="text-body-sm text-muted-foreground" aria-live="polite">
        {finished ? `دقت: ${pct(accuracy)} (نسخه‌ی منتشرشده: ${pct(row.accuracy)})` : `بررسی نمونه‌ی ${(done + 1).toLocaleString("fa-IR")} از ${cases.length.toLocaleString("fa-IR")}…`}
      </p>
      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
        {cases.slice(0, done).map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 px-3 py-2 text-body-sm">
            <span>{c.question}</span>
            {c.pass ? (
              <span className="flex shrink-0 items-center gap-1 text-success"><CheckCircle2Icon aria-hidden className="size-4" />درست</span>
            ) : (
              <span className="flex shrink-0 items-center gap-1 text-destructive"><XCircleIcon aria-hidden className="size-4" />نادرست</span>
            )}
          </li>
        ))}
      </ul>
      {finished ? (
        blocked ? (
          <Alert variant="destructive">
            <XCircleIcon aria-hidden />
            <AlertTitle>انتشار متوقف شد</AlertTitle>
            <AlertDescription>دقت از {pct(row.accuracy)} به {pct(accuracy)} افت کرد؛ نسخه‌ی {ver(target.version)} منتشر نمی‌شود و نسخه‌ی فعلی می‌ماند.</AlertDescription>
          </Alert>
        ) : (
          <Alert variant="success">
            <CheckCircle2Icon aria-hidden />
            <AlertTitle>{row.candidate ? "آماده‌ی انتشار" : "ارزیابی تمام شد"}</AlertTitle>
            <AlertDescription>{row.candidate ? "دقت افت نکرد؛ می‌توانید نسخه را منتشر کنید." : "دقت نسخه‌ی فعلی به‌روز شد."}</AlertDescription>
          </Alert>
        )
      ) : null}
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>{finished ? "بستن" : "توقف ارزیابی"}</Button>
      </DialogFooter>
    </>
  );
}
