import { FileTextIcon, FilmIcon, ImageIcon, MusicIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = { image: ImageIcon, video: FilmIcon, audio: MusicIcon, doc: FileTextIcon };

/** Grey cover placeholder of the template. */
export function Cover({ kind = "image", className }: { kind?: string; className?: string }) {
  const Icon = icons[kind] ?? ImageIcon;
  return <div className={cn("flex aspect-video w-full items-center justify-center rounded-xl bg-muted text-muted-foreground", className)} aria-hidden><Icon className="size-12" /></div>;
}

export function TagChip({ children }: { children: string }) {
  return <span className="rounded-full bg-accent px-2.5 py-0.5 text-caption text-accent-foreground">{children}</span>;
}
