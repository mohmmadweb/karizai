"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useDemoFlags } from "@/lib/demo-flags";
import { cn } from "@/lib/utils";

type AiAnswerProps = { children: ReactNode; /** Pause before the answer shows, in ms. */ delay?: number; className?: string };

/**
 * A prepared answer of the assistant: a short «thinking» pause, then the content. It always comes
 * from the internal model, so it keeps working when the internet is cut. Remount (key) to replay.
 */
export function AiAnswer({ children, delay = 700, className }: AiAnswerProps) {
  const { offline } = useDemoFlags();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);
  return (
    <section aria-live="polite" aria-busy={!ready} className={cn("flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-body-sm", className)}>
      <p className="flex items-center gap-1.5 text-caption font-medium text-primary">
        <span aria-hidden>✦</span>کاریز AI · مدل داخلی{offline ? " · بدون اینترنت" : ""}
      </p>
      {ready ? children : <span className="flex items-center gap-2 text-muted-foreground"><Spinner />در حال آماده‌کردن پاسخ...</span>}
    </section>
  );
}
