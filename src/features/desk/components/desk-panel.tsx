import type { ReactNode } from "react";
import Link from "@/components/shared/app-link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toneClasses, type DeskTone } from "./desk-tones";

type DeskPanelProps = { tone: DeskTone; title: string; icon: LucideIcon; href?: string; linkLabel?: string; badge?: ReactNode; empty: string; isEmpty: boolean; children: ReactNode };

/** One block of the desk: an icon and a title, an optional link to the full page, and a list of rows. */
export function DeskPanel({ tone, title, icon: Icon, href, linkLabel, badge, empty, isEmpty, children }: DeskPanelProps) {
  return (
    <Card className={cn("gap-0 border-t-4 py-0", toneClasses[tone].bar)}>
      <header className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <h2 className="flex items-center gap-2.5 text-h4">
          <span className={cn("flex size-9 items-center justify-center rounded-xl", toneClasses[tone].chip)}><Icon className="size-5" aria-hidden /></span>
          {title}
          {badge}
        </h2>
        {href && linkLabel ? <Link href={href} className="shrink-0 text-body-sm text-primary underline-offset-4 hover:underline">{linkLabel}</Link> : null}
      </header>
      <CardContent className="px-5 py-3">
        {isEmpty ? <p className="py-4 text-center text-body-sm text-muted-foreground">{empty}</p> : <ul className="flex flex-col divide-y">{children}</ul>}
      </CardContent>
    </Card>
  );
}
