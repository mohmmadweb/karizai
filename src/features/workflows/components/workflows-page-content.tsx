"use client";

import { useState } from "react";
import { PlusIcon, WorkflowIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { LiveSwitch } from "@/features/live/components/live-switch";
import { NewWorkflowDialog } from "./new-workflow-dialog";
import { WorkflowCard } from "./workflow-card";
import { useWorkflows } from "./workflows-provider";

export function WorkflowsPageContent() {
  const { workflows } = useWorkflows();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const filtered = workflows.filter((item) => `${item.name} ${item.description}`.includes(query.trim()));
  const createButton = <Button onClick={() => setCreating(true)}><PlusIcon aria-hidden />جریان تازه</Button>;

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="جریان‌ها" description="جریان، چند گام پشت‌سرهم است که Agentها و ابزارها انجام می‌دهند؛ دستی، زمان‌بندی‌شده یا با یک رویداد شروع می‌شود." action={<div className="flex flex-wrap items-center gap-2"><LiveSwitch />{workflows.length > 0 ? createButton : null}</div>} />
      {workflows.length === 0 ? (
        <EmptyState icon={<WorkflowIcon />} title="هنوز جریانی نساخته‌اید" description="از یک قالب آماده یا با یک جمله شروع کنید." action={createButton} />
      ) : (
        <>
          <SearchField value={query} onValueChange={setQuery} label="جست‌وجو در جریان‌ها" placeholder="جست‌وجو در جریان‌ها" />
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-body text-muted-foreground">جریانی پیدا نشد.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <WorkflowCard key={item.id} workflow={item} />)}</div>
          )}
        </>
      )}
      <NewWorkflowDialog open={creating} onOpenChange={setCreating} />
    </div>
  );
}
