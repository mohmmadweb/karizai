"use client";

import { usePathname } from "next/navigation";
import { SparklesIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAiPanel } from "./ai-panel-provider";

/** Floating «دستیار کاریز AI» button on every page of the user panel. On the chat it leaves room for the message box. */
export function AiFab() {
  const pathname = usePathname();
  const { openPanel } = useAiPanel();
  const onChat = pathname === "/chat" || pathname.startsWith("/chat/");
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            data-ai
            aria-label="دستیار کاریز AI"
            onClick={() => openPanel()}
            className={cn(
              "fixed bottom-5 end-5 z-sticky flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg outline-none transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
              onChat && "max-xl:hidden",
            )}
          />
        }
      >
        <SparklesIcon className="size-6" aria-hidden />
      </TooltipTrigger>
      <TooltipContent side="top">دستیار کاریز AI</TooltipContent>
    </Tooltip>
  );
}
