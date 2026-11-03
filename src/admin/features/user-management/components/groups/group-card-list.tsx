"use client";

import type { ReactNode } from "react";
import { SearchField } from "@/components/shared/search-field";
import type { Group, Membership } from "../../types";
import { GroupCard } from "./group-card";

type GroupCardListProps = {
  groups: Group[];
  memberships: Membership[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  /** Shown in place of the cards when the search matches no group. */
  noResults: ReactNode;
};

/**
 * Bordered box with the search field fixed at the top and the cards below.
 * On wide screens the cards scroll inside the box; on phones the box grows and the page scrolls.
 */
export function GroupCardList({
  groups,
  memberships,
  selectedId,
  onSelect,
  query,
  onQueryChange,
  noResults,
}: GroupCardListProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:max-h-[calc(100svh-14rem)]">
      <div className="border-b border-border p-3">
        <SearchField
          label="جست‌وجوی گروه‌ها"
          placeholder="جست‌وجو بر اساس نام یا کد گروه"
          value={query}
          onValueChange={onQueryChange}
          className="sm:max-w-none"
        />
      </div>
      {groups.length === 0 ? (
        noResults
      ) : (
        <ul
          aria-label="فهرست گروه‌ها"
          className="flex flex-col gap-3 p-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
        >
          {groups.map((group) => (
            <li key={group.id}>
              <GroupCard
                group={group}
                memberCount={memberships.filter((m) => m.groupId === group.id).length}
                selected={group.id === selectedId}
                onSelect={() => onSelect(group.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
