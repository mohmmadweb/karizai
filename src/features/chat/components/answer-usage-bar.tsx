"use client";

import { ClockIcon, CoinsIcon } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { answerUsage } from "../lib/answer-usage";
import type { Message } from "../types";

/** Tokens in and out, cost in toman and time, under every finished answer (R11.2). */
export function AnswerUsageBar({ message, question, internal }: { message: Message; question: string; internal: boolean }) {
  const usage = answerUsage(message, question, internal);
  return (
    <p data-ai className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption tabular-nums text-muted-foreground" aria-label="مصرف این پاسخ">
      <span>ورودی {formatNumber(usage.inputTokens)} توکن</span>
      <span>خروجی {formatNumber(usage.outputTokens)} توکن</span>
      <span className="inline-flex items-center gap-1"><CoinsIcon className="size-3.5" aria-hidden />{formatNumber(usage.costToman)} تومان</span>
      <span className="inline-flex items-center gap-1"><ClockIcon className="size-3.5" aria-hidden />{formatNumber(usage.seconds, { maximumFractionDigits: 1 })} ثانیه</span>
    </p>
  );
}
