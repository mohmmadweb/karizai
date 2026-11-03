"use client";

import { useState } from "react";
import Link from "next/link";
import { BotIcon, PlusIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { buttonVariants } from "@/components/ui/button";
import { AgentCard } from "./agent-card";
import { useAgents } from "./agents-provider";

export function AgentsPageContent() {
  const { agents } = useAgents();
  const [query, setQuery] = useState("");
  const mine = agents.filter((agent) => agent.kind === "personal");
  const shared = agents.filter((agent) => agent.kind === "shared" && `${agent.name} ${agent.purpose}`.includes(query.trim()));
  const filtered = mine.filter((agent) => `${agent.name} ${agent.purpose}`.includes(query.trim()));
  const createLink = <Link href="/agents/new" className={buttonVariants()}><PlusIcon aria-hidden />✦ ساخت Agent</Link>;

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="عامل‌های من" description="Agentهایی که خودتان ساخته‌اید. بعد از ذخیره، همین حالا در گفتگو برای شما قابل استفاده‌اند." action={mine.length > 0 ? createLink : undefined} />
      {mine.length === 0 ? (
        <EmptyState icon={<BotIcon />} title="هنوز Agentی نساخته‌اید" description="اولین Agent خودتان را بسازید و در گفتگو صدایش بزنید." action={<Link href="/agents/new" className={buttonVariants()}>ساخت اولین Agent</Link>} />
      ) : (
        <>
          <SearchField value={query} onValueChange={setQuery} label="جست‌وجو در Agentها" placeholder="جست‌وجو در Agentها" />
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-body text-muted-foreground">Agentی پیدا نشد.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
            </div>
          )}
        </>
      )}
      {shared.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-h4">Agentهای اشتراکی و آماده</h2>
          <p className="text-body-sm text-muted-foreground">این Agentها را ادمین یا همکارانتان در اختیار شما گذاشته‌اند؛ با دکمه‌ی Agent در گفتگو صدایشان بزنید.</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{shared.map((agent) => <AgentCard key={agent.id} agent={agent} readOnly />)}</div>
        </section>
      ) : null}
    </div>
  );
}
