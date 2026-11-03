"use client";

import { ShieldCheckIcon } from "lucide-react";
import { applyMasks, usePolicies } from "@/lib/policy-store";
import { normalizeDigits } from "../lib/sensitive-check";

/** While the user types: what the admin's mask fields will hide before an external model sees the text. */
export function MaskHint({ text }: { text: string }) {
  const { maskFields } = usePolicies();
  if (!text.trim()) return null;
  const { masked, found, internalOnly } = applyMasks(normalizeDigits(text), maskFields);
  if (found.length === 0) return null;
  const labels = [...new Set(found.map((item) => item.label))].join("، ");
  return (
    <div data-ai className="flex flex-col gap-1 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-caption" aria-live="polite">
      <span className="flex items-center gap-1.5 text-label text-primary"><ShieldCheckIcon className="size-4" aria-hidden />
        {internalOnly ? `✦ ${labels}: این پیام فقط به مدل داخلی فرستاده می‌شود.` : `✦ پیش از ارسال به مدل بیرونی پوشانده می‌شود: ${labels}`}
      </span>
      {internalOnly ? null : <span className="text-muted-foreground">آنچه مدل بیرونی می‌بیند: <span className="text-foreground">{masked}</span></span>}
    </div>
  );
}
