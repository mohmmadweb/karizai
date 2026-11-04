import { CalendarDaysIcon, FileTextIcon, FilmIcon, ImageIcon, MusicIcon, NewspaperIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = { image: ImageIcon, video: FilmIcon, audio: MusicIcon, doc: FileTextIcon, event: CalendarDaysIcon, blog: NewspaperIcon };

/** A soft navy-to-blue gradient picked from the item id (CSS only). */
function gradientOf(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const hue = 212 + (hash % 18);
  const angle = 120 + (hash % 5) * 20;
  return `linear-gradient(${angle}deg, hsl(${hue - 4} 52% 24%), hsl(${hue + 8} 62% 44%))`;
}

/** Designed cover: gradient by item id, a large faint icon by content type and the category text. */
export function Cover({ kind = "image", id = kind, category, className }: { kind?: string; id?: string; category?: string; className?: string }) {
  const Icon = icons[kind] ?? ImageIcon;
  return (
    <div className={cn("relative flex aspect-video w-full items-end overflow-hidden rounded-xl p-3 text-white", className)} style={{ backgroundImage: gradientOf(id) }} aria-hidden>
      <Icon className="absolute -start-3 -top-3 size-28 text-white/15" strokeWidth={1.25} />
      {category ? <span className="relative rounded-full bg-white/15 px-2.5 py-0.5 text-caption backdrop-blur-sm">{category}</span> : null}
    </div>
  );
}

export function TagChip({ children }: { children: string }) {
  return <span className="rounded-full bg-accent px-2.5 py-0.5 text-caption text-accent-foreground">{children}</span>;
}
