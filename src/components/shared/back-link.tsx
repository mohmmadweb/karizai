import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

/** In RTL the arrow points to the end of the line, away from the page. */
export function BackLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-1 rounded-sm text-body-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ArrowRightIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden />
      {children}
    </Link>
  );
}
