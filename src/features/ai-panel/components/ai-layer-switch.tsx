"use client";

import { useAiPanel } from "./ai-panel-provider";

/** Switch in the top bar that outlines the parts of the page Kariz AI added. The choice is temporary. */
export function AiLayerSwitch() {
  const { aiLayer, setAiLayer } = useAiPanel();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={aiLayer}
      title="نمایش بخش‌هایی که کاریز AI اضافه کرده"
      onClick={() => setAiLayer(!aiLayer)}
      className="hidden h-10 shrink-0 items-center gap-2 rounded-lg px-2 text-label outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 md:flex"
    >
      <span aria-hidden className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors motion-reduce:transition-none ${aiLayer ? "justify-end bg-primary" : "justify-start bg-muted-foreground/30"}`}>
        <span className="size-4 rounded-full bg-card shadow-sm" />
      </span>
      <span className="hidden 2xl:inline">نمایش لایه AI</span>
      <span className="sr-only 2xl:hidden">نمایش لایه AI</span>
    </button>
  );
}
