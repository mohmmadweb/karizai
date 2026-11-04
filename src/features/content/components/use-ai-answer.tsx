"use client";

import { useState } from "react";
import { AiButton } from "@/features/social/components/ai-button";
import { simulateRequest } from "@/lib/simulate-request";

/** State of a «✦» button: it waits a moment, then shows its canned answer. */
export function useAiAnswer(answer: string) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  async function run() {
    setState("loading");
    await simulateRequest(700);
    setState("done");
  }
  return { state, run, answer, close: () => setState("idle") };
}

export function AiAnswerBox({ text, onClose }: { text: string; onClose?: () => void }) {
  return (
    <div data-ai className="flex flex-col gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-body-sm" aria-live="polite">
      <span className="text-caption font-semibold text-primary">✦ کاریز AI · مدل داخلی</span>
      <p className="whitespace-pre-line leading-7">{text}</p>
      {onClose ? <button type="button" onClick={onClose} className="w-fit text-caption text-muted-foreground hover:text-foreground">بستن</button> : null}
    </div>
  );
}

/** A «✦» button with its answer right under it. */
export function AiNote({ label, answer }: { label: string; answer: string }) {
  const ai = useAiAnswer(answer);
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <AiButton label={ai.state === "loading" ? "در حال تهیه…" : label} onClick={ai.run} disabled={ai.state === "loading"} data-ai className="w-fit" />
      {ai.state === "done" ? <AiAnswerBox text={ai.answer} onClose={ai.close} /> : null}
    </div>
  );
}
