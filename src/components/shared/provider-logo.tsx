import { BotIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Colour marks that identify a model's maker. They are drawn here (a coloured tile with a letter), not the
 * makers' own artwork, and their colours are data that identify a maker, so they are not design tokens.
 */
const makers: { match: RegExp; color: string; glyph: string }[] = [
  { match: /openai|gpt/i, color: "#10a37f", glyph: "O" },
  { match: /anthropic|claude/i, color: "#d97757", glyph: "A" },
  { match: /google|gemini/i, color: "#4285f4", glyph: "G" },
  { match: /deepseek/i, color: "#4d6bfe", glyph: "D" },
  { match: /alibaba|qwen/i, color: "#615ced", glyph: "Q" },
  { match: /meta|llama/i, color: "#0866ff", glyph: "M" },
  { match: /mistral/i, color: "#fa520f", glyph: "M" },
];

/** A small coloured tile for the maker of a model, found from its provider or model name. Unknown makers get a neutral robot. */
export function ProviderLogo({ name, className }: { name: string; className?: string }) {
  const maker = makers.find((item) => item.match.test(name));
  if (!maker) {
    return <span aria-hidden className={cn("inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground", className)}><BotIcon className="size-3.5" /></span>;
  }
  return (
    <span aria-hidden dir="ltr" className={cn("inline-flex size-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold leading-none text-white", className)} style={{ backgroundColor: maker.color }}>
      {maker.glyph}
    </span>
  );
}
