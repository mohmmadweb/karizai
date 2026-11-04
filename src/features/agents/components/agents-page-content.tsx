"use client";

import { useState } from "react";
import Link from "@/components/shared/app-link";
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
  const createLink = <Link href="/agents/new" className={buttonVariants()}><PlusIcon aria-hidden />✦ ساخت عامل</Link>;

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="عامل‌های من" description="عامل‌هایی که خودتان ساخته‌اید. بعد از ذخیره، همین حالا در گفتگو برای شما قابل استفاده‌اند." action={mine.length > 0 ? createLink : undefined} />
      {mine.length === 0 ? (
        <EmptyState icon={<BotIcon />} title="هنوز عاملی نساخته‌اید" description="اولین عامل خودتان را بسازید و در گفتگو صدایش بزنید." action={<Link href="/agents/new" className={buttonVariants()}>ساخت اولین عامل</Link>} />
      ) : (
        <>
          <SearchField value={query} onValueChange={setQuery} label="جست‌وجو در عامل‌ها" placeholder="جست‌وجو در عامل‌ها" />
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-body text-muted-foreground">عاملی پیدا نشد.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
            </div>
          )}
        </>
      )}
      {shared.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-h4">عامل‌های اشتراکی و آماده</h2>
          <p className="text-body-sm text-muted-foreground">این عامل‌ها را ادمین یا همکارانتان در اختیار شما گذاشته‌اند؛ با دکمه‌ی عامل در گفتگو صدایشان بزنید.</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{shared.map((agent) => <AgentCard key={agent.id} agent={agent} readOnly />)}</div>
        </section>
      ) : null}
    </div>
  );
}
