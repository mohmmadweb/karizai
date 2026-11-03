"use client";

import { useState } from "react";
import { SearchXIcon } from "lucide-react";
import { FilterSelect } from "@/admin/features/audit/components/filter-select";
import { StatCards } from "@/admin/features/audit/components/stat-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { AgentGovernanceProvider, useOrgAgents } from "./agent-governance-provider";
import { AgentSheet } from "./agent-sheet";
import { AgentsTable } from "./agents-table";

const originOptions = [
  { value: "all", label: "همه" },
  { value: "official", label: "رسمی سازمان" },
  { value: "shared", label: "اشتراکی" },
  { value: "personal", label: "شخصی" },
];
const n = (v: number) => v.toLocaleString("fa-IR");

function Content() {
  const { agents, update } = useOrgAgents();
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = agents.filter((a) => (origin === "all" || a.origin === origin) && (a.name.includes(query.trim()) || a.owner.includes(query.trim())));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="عامل‌ها"
        description="همه‌ی عامل‌های سازمان: مالک، سیاست مدل، ابزار و داده‌ی مجاز، و حد اقدام‌های نوشتنی. عامل‌ها از این حدود بیرون نمی‌روند."
      />
      <StatCards
        items={[
          { label: "عامل‌های سازمان", value: n(agents.length) },
          { label: "حساس (فقط مدل داخلی)", value: n(agents.filter((a) => a.sensitive).length) },
          { label: "با ابزار نوشتنی", value: n(agents.filter((a) => a.tools.some((t) => t.enabled && t.mode === "readwrite")).length) },
          { label: "در انتظار تأیید", value: n(agents.filter((a) => a.status === "pending").length) },
        ]}
      />
      <div className="flex flex-wrap items-end gap-4">
        <SearchField label="جست‌وجوی عامل‌ها" placeholder="نام عامل یا مالک" value={query} onValueChange={setQuery} />
        <FilterSelect id="agents-origin" label="نوع" value={origin} options={originOptions} onValueChange={setOrigin} />
      </div>
      {rows.length === 0 ? (
        <EmptyState icon={<SearchXIcon />} title="عاملی پیدا نشد" description="نام یا نوع دیگری را امتحان کنید." />
      ) : (
        <AgentsTable agents={rows} onOpen={(a) => setOpenId(a.id)} />
      )}
      <AgentSheet agent={agents.find((a) => a.id === openId) ?? null} onOpenChange={(open) => !open && setOpenId(null)} onSave={update} />
    </div>
  );
}

/** «عامل‌ها» in the admin panel. Changes are temporary and reset on reload. */
export function AgentsAdminContent() {
  return (
    <AgentGovernanceProvider>
      <Content />
    </AgentGovernanceProvider>
  );
}
