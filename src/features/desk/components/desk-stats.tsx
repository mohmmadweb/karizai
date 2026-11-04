import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneClasses, type DeskTone } from "./desk-tones";

export type DeskStat = { label: string; value: number; icon: LucideIcon; tone: DeskTone; href: string };

/** Four big numbers at the top of the desk, each a link to where it is handled. */
export function DeskStats({ stats }: { stats: DeskStat[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <li key={stat.label}>
          <Link href={stat.href} className={cn("flex items-center gap-3 rounded-2xl border p-4 outline-none transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50", toneClasses[stat.tone].tile)}>
            <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", toneClasses[stat.tone].chip)}><stat.icon className="size-5" aria-hidden /></span>
            <span className="flex flex-col">
              <span className="text-h2 leading-none">{stat.value.toLocaleString("fa-IR")}</span>
              <span className="text-body-sm text-muted-foreground">{stat.label}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
