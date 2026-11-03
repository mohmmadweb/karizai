"use client";

import { useState } from "react";
import { WandSparklesIcon } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { savedPercent } from "../lib/prompt-optimizer";
import type { PromptOptimization } from "../types";

/** What «✦ بهینه‌ساز پرامپت» changed: tokens before and after, and both prompts on request (R3a.7, R3a.8). */
export function OptimizationDetails({ item }: { item: PromptOptimization }) {
  const [open, setOpen] = useState(false);
  return (
    <div data-ai className="flex flex-col gap-2">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="inline-flex w-fit items-center gap-1.5 rounded-sm text-caption text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
        <WandSparklesIcon className="size-3.5" aria-hidden />
        ✦ بهینه‌ساز پرامپت: توکن قبل {formatNumber(item.before)} / بعد {formatNumber(item.after)} · {formatNumber(savedPercent(item))}٪ صرفه‌جویی
      </button>
      {open ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex flex-col gap-1 rounded-lg bg-muted p-3"><span className="text-label">پرامپت اصلی</span><p className="whitespace-pre-wrap text-body-sm">{item.original}</p></div>
          <div className="flex flex-col gap-1 rounded-lg bg-muted p-3"><span className="text-label">پرامپت فشرده</span><p className="whitespace-pre-wrap text-body-sm">{item.compressed}</p></div>
        </div>
      ) : null}
    </div>
  );
}
