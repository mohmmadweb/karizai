"use client";

import { UsersIcon } from "lucide-react";
import { formatNumber } from "@/admin/lib/format";
import { cn } from "@/lib/utils";
import type { Group } from "../../types";
import { StatusBadge } from "../status-badge";

type GroupCardProps = {
  group: Group;
  memberCount: number;
  selected: boolean;
  onSelect: () => void;
};

/** One selectable group in the groups list; the selected card is marked by border, tint, and text. */
export function GroupCard({ group, memberCount, selected, onSelect }: GroupCardProps) {
  return (
    <button
      type="button"
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      className={cn(
        "flex min-h-11 w-full flex-col gap-2 rounded-xl border p-4 text-start outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-2 border-primary bg-accent text-accent-foreground"
          : "border-border bg-card text-card-foreground hover:bg-muted",
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0 text-label">{group.name}</span>
        <span className="flex shrink-0 items-center gap-2">
          {selected ? <span className="sr-only">انتخاب‌شده</span> : null}
          <bdi dir="ltr" className="text-caption text-muted-foreground">
            {group.code}
          </bdi>
          <StatusBadge status={group.status} />
        </span>
      </span>
      <span className="flex items-center gap-1 text-caption text-muted-foreground">
        <UsersIcon className="size-4" aria-hidden />
        {formatNumber(memberCount)} عضو
      </span>
    </button>
  );
}
