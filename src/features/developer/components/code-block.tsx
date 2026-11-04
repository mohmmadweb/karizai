"use client";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Left-to-right code with a copy button. */
export function CodeBlock({ code, label, className }: { code: string; label?: string; className?: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("کپی شد.");
    } catch {
      toast.error("کپی ممکن نشد؛ متن را دستی انتخاب کنید.");
    }
  }
  return (
    <div className={cn("relative min-w-0 max-w-full rounded-lg border bg-muted/50", className)}>
      <Button type="button" variant="ghost" size="icon-sm" className="absolute right-1 top-1 z-10 bg-muted/80" aria-label={`کپی ${label ?? "کد"}`} onClick={() => void copy()}><CopyIcon aria-hidden /></Button>
      <pre dir="ltr" style={{ unicodeBidi: "isolate" }} className="max-w-full overflow-x-auto p-3 pr-11 text-left font-mono text-caption leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}
