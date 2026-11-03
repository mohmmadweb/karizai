"use client";

import { ShieldCheckIcon } from "lucide-react";
import { usePolicies } from "@/features/policies/components/policies-provider";
import { maskWithPolicy } from "@/lib/masking";

/** While the user types: what the saved policies will hide before an external model sees the text. */
export function MaskHint({ text }: { text: string }) {
  const { masking } = usePolicies();
  if (!text.trim()) return null;
  const { masked, count } = maskWithPolicy(text, masking);
  if (count === 0) return null;
  return (
    <div data-ai className="flex flex-col gap-1 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-caption" aria-live="polite">
      <span className="flex items-center gap-1.5 text-label text-primary"><ShieldCheckIcon className="size-4" aria-hidden />
        ✦ پیش از ارسال به مدل بیرونی {count.toLocaleString("fa-IR")} مورد پوشانده می‌شود
      </span>
      <span className="text-muted-foreground">آنچه مدل بیرونی می‌بیند: <span className="text-foreground" dir="auto">{masked}</span></span>
    </div>
  );
}
