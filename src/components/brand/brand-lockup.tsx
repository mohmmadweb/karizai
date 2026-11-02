import { BrandLogo } from "./brand-logo";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  /** Persian alt text for the name; the mark is decorative. */
  alt: string;
  tone?: "auto" | "color" | "white";
  /** The mark above the name, for the sign-in page. */
  stacked?: boolean;
  /** Width utilities for the mark and the name. */
  markClassName?: string;
  textClassName?: string;
  priority?: boolean;
};

/** The Kariz mark beside (or above) the name. */
export function BrandLockup({ alt, tone = "auto", stacked = false, markClassName = "w-9", textClassName = "w-24", priority }: BrandLockupProps) {
  return (
    <span className={cn("flex items-center", stacked ? "flex-col gap-3" : "gap-2.5")}>
      <BrandLogo alt="" variant="kariz" tone={tone} className={markClassName} priority={priority} />
      <BrandLogo alt={alt} variant="text" tone={tone} className={textClassName} priority={priority} />
    </span>
  );
}
