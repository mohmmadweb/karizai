import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

type EntityNotFoundProps = { title: string; backHref: string; backLabel: string };

export function EntityNotFound({ title, backHref, backLabel }: EntityNotFoundProps) {
  return (
    <EmptyState
      icon={<SearchXIcon />}
      title={title}
      description="ممکن است آدرس درست نباشد."
      action={
        <Link href={backHref} className={buttonVariants({ variant: "outline" })}>
          {backLabel}
        </Link>
      }
    />
  );
}
