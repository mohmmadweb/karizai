"use client";

import { useState } from "react";
import { PlusIcon, SparklesIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { useAgents } from "@/features/agents/components/agents-provider";
import { OrgSkillsSection } from "./org-skills-section";
import { SkillCard } from "./skill-card";
import { SkillFormDialog } from "./skill-form-dialog";

export function SkillsPageContent() {
  const { skills, addSkill } = useAgents();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const filtered = skills.filter((skill) => `${skill.name} ${skill.description}`.includes(query.trim()));

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="اسکیل‌های من" description="اسکیل، دستورالعمل آماده‌ای است که به عامل توانایی تازه می‌دهد. اسکیل تازه یا ویرایش‌شده باید ادمین تأیید کند." action={<Button onClick={() => setCreating(true)}><PlusIcon aria-hidden />اسکیل تازه</Button>} />
      <SearchField value={query} onValueChange={setQuery} label="جست‌وجو در اسکیل‌ها" placeholder="جست‌وجو در اسکیل‌ها" />
      {skills.length === 0 ? (
        <EmptyState icon={<SparklesIcon />} title="هنوز اسکیلی ندارید" description="اولین اسکیل را بسازید یا از فایل وارد کنید." />
      ) : filtered.length === 0 ? (
        <p className="py-6 text-center text-body text-muted-foreground">اسکیلی پیدا نشد.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((skill) => <SkillCard key={skill.id} skill={skill} />)}</div>
      )}
      <OrgSkillsSection />
      {creating ? <SkillFormDialog open onOpenChange={setCreating} onSave={(content) => addSkill(content)} /> : null}
    </div>
  );
}
