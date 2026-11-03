"use client";

import { useCallback } from "react";
import { formatNumber } from "@/admin/lib/format";
import { useTheme } from "@/admin/lib/use-theme";
import { tokenContrast } from "../data/contrast";

type ContrastReadingProps = {
  background: string;
  foreground: string;
  target: number;
};

/** Live contrast of two tokens in the current theme (changes with the toggle). */
export function ContrastReading({ background, foreground, target }: ContrastReadingProps) {
  const { theme } = useTheme();
  const measure = useCallback(
    (el: HTMLSpanElement | null) => {
      if (!el) return;
      const ratio = tokenContrast(background, foreground);
      const passes = ratio >= target;
      el.dataset.pass = String(passes);
      el.textContent = `کنتراست ${formatNumber(ratio, { maximumFractionDigits: 1 })} به ۱ (حداقل ${formatNumber(target)}) · ${passes ? "قابل قبول" : "ناکافی"}`;
    },
    [background, foreground, target],
  );
  // `key` remounts the reading when the theme changes so it is measured again.
  return (
    <span
      key={theme}
      ref={measure}
      className="text-caption text-muted-foreground data-[pass=false]:font-semibold data-[pass=false]:text-destructive"
    />
  );
}
