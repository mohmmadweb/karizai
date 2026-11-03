"use client";

import type { ReactNode } from "react";
import type { Group, Membership } from "../../types";
import { GroupCardList } from "./group-card-list";
import { GroupMembersPanel } from "./group-members-panel";

type GroupsSplitViewProps = {
  groups: Group[];
  memberships: Membership[];
  selected: Group | undefined;
  onSelect: (id: string) => void;
  /** Shown in place of the cards when the search matches no group. */
  noResults: ReactNode;
  query: string;
  onQueryChange: (query: string) => void;
};

/** Cards at the start side and the members panel at the end side from `lg`; stacked below. */
export function GroupsSplitView({ groups, memberships, selected, onSelect, noResults, query, onQueryChange }: GroupsSplitViewProps) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <GroupCardList
        groups={groups}
        memberships={memberships}
        selectedId={selected?.id}
        onSelect={onSelect}
        query={query}
        onQueryChange={onQueryChange}
        noResults={noResults}
      />
      <GroupMembersPanel group={selected} />
    </div>
  );
}
