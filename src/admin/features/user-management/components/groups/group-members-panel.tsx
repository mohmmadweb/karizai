"use client";

import Link from "next/link";
import { ExternalLinkIcon, MousePointerClickIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Group } from "../../types";
import { GroupMembersManager } from "./group-members-manager";

/** Members of the selected group, with add and remove only. Editing stays on the group page. */
export function GroupMembersPanel({ group }: { group: Group | undefined }) {
  if (!group) {
    return (
      <section className="rounded-xl border border-border bg-card p-4">
        <EmptyState
          icon={<MousePointerClickIcon />}
          title="گروهی انتخاب نشده است"
          description="یک گروه را از فهرست انتخاب کنید تا اعضای آن را ببینید."
        />
      </section>
    );
  }

  return (
    <section
      aria-label={`اعضای گروه ${group.name}`}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-20"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-h4 text-foreground">{group.name}</h2>
          <bdi dir="ltr" className="text-start text-body-sm text-muted-foreground">
            {group.code}
          </bdi>
        </div>
        <Link
          href={`/admin/groups/${group.id}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          جزئیات گروه
          <ExternalLinkIcon aria-hidden />
        </Link>
      </header>
      <GroupMembersManager key={group.id} group={group} idPrefix="group-panel" />
    </section>
  );
}
