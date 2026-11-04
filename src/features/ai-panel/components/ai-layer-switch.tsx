"use client";

import { SparklesIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAiPanel } from "./ai-panel-provider";

/** Switch in the top bar that outlines the parts of the page Kariz AI added. The choice is temporary. */
export function AiLayerSwitch() {
  const { aiLayer, setAiLayer } = useAiPanel();
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            role="switch"
            aria-checked={aiLayer}
            aria-label="نمایش لایه AI"
            onClick={() => setAiLayer(!aiLayer)}
            className={cn(
              "hidden size-10 shrink-0 items-center justify-center rounded-lg border outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 md:flex",
              aiLayer ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted",
            )}
          />
        }
      >
        <SparklesIcon className="size-4" aria-hidden />
      </TooltipTrigger>
      <TooltipContent>نمایش لایه AI: بخش‌هایی که کاریز AI اضافه کرده پررنگ می‌شوند</TooltipContent>
    </Tooltip>
  );
}
