"use client";

import { useState } from "react";
import { SearchXIcon, UsersRoundIcon, PlusIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useDirectory } from "../../hooks/use-directory";
import { filterGroups } from "../../lib/selectors";
import { AddGroupDialog } from "./add-group-dialog";
import { GroupsSplitView } from "./groups-split-view";

export function GroupsPageContent() {
  const { groups, memberships } = useDirectory();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const visible = filterGroups(groups, query);
  const selected = visible.find((g) => g.id === selectedId) ?? visible[0];

  const createButton = (
    <Button onClick={() => setCreating(true)}>
      <PlusIcon aria-hidden />
      ساخت گروه
    </Button>
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="گروه‌ها"
        action={createButton}
      />
      {groups.length === 0 ? (
        <EmptyState
          icon={<UsersRoundIcon />}
          title="هنوز گروهی ساخته نشده است"
          description="با ساخت اولین گروه شروع کنید."
          action={createButton}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <GroupsSplitView
            groups={visible}
            memberships={memberships}
            selected={selected}
            onSelect={setSelectedId}
            query={query}
            onQueryChange={setQuery}
            noResults={
              <EmptyState
                icon={<SearchXIcon />}
                title="گروهی پیدا نشد"
                description="نام یا کد دیگری را امتحان کنید."
                action={
                  <Button variant="outline" onClick={() => setQuery("")}>
                    پاک‌کردن جست‌وجو
                  </Button>
                }
              />
            }
          />
        </div>
      )}
      <AddGroupDialog
        open={creating}
        onOpenChange={setCreating}
        onCreated={(id) => {
          setQuery("");
          setSelectedId(id);
        }}
      />
    </div>
  );
}
