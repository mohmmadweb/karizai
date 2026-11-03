"use client";

import { useState } from "react";
import { LibraryBigIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAgents } from "@/features/agents/components/agents-provider";
import { getRepositoryAgents, repositoryCategories } from "../data/repository-agents";
import { RepositoryAgentCard } from "./repository-agent-card";

const allCategories = "همه";

export function AgentRepositoryPageContent() {
  const { agents, saveAgent } = useAgents();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allCategories);
  const items = getRepositoryAgents();
  const filtered = items.filter((item) => (category === allCategories || item.category === category) && `${item.name} ${item.purpose}`.includes(query.trim()));
  // A copy already in the user's list carries the same name.
  const isAdded = (name: string) => agents.some((agent) => agent.kind === "personal" && agent.name === name);

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="مخزن عامل‌ها" description="بسته‌های رسمی کاریز و عامل‌هایی که همکاران عمومی کرده‌اند را ببینید و به عامل‌های خود اضافه کنید. عامل اضافه‌شده یک نسخه‌ی شخصی برای شماست و می‌توانید ویرایشش کنید." />
      <SearchField value={query} onValueChange={setQuery} label="جست‌وجو در مخزن عامل‌ها" placeholder="جست‌وجو در مخزن عامل‌ها" />
      <Tabs value={category} onValueChange={(value) => setCategory(String(value))} className="overflow-x-auto">
        <TabsList aria-label="دسته‌بندی">
          {repositoryCategories.map((item) => <TabsTrigger key={item} value={item} className="px-3">{item}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      {filtered.length === 0 ? (
        <EmptyState icon={<LibraryBigIcon />} title="عاملی پیدا نشد" description="عبارت جست‌وجو یا دسته را عوض کنید." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <RepositoryAgentCard
              key={item.id}
              agent={item}
              added={isAdded(item.name)}
              onAdd={() => {
                saveAgent(null, { name: item.name, purpose: item.purpose, instructions: item.instructions, defaultModelId: item.defaultModelId, tools: item.tools, skillIds: [], knowledgeIds: [], modelPolicy: "auto", runIn: ["assistant"] });
                toast.success(`«${item.name}» به عامل‌های من اضافه شد.`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
