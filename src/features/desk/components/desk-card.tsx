import type { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DeskCardProps = { title: string; href: string; linkLabel: string; empty: string; children: ReactNode; isEmpty: boolean };

/** One block of the desk: a title, a short list, and the link to the full page. */
export function DeskCard({ title, href, linkLabel, empty, children, isEmpty }: DeskCardProps) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-h4">{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isEmpty ? <p className="text-body-sm text-muted-foreground">{empty}</p> : <ul className="flex flex-col gap-2">{children}</ul>}
        <Link href={href} className="w-fit text-body-sm text-primary underline-offset-4 hover:underline">{linkLabel}</Link>
      </CardContent>
    </Card>
  );
}
