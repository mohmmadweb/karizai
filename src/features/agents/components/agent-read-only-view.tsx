"use client";

import { BackLink } from "@/components/shared/back-link";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { useConnections } from "@/features/connections/components/connections-provider";
import type { CatalogModel } from "@/features/model-catalog/types";
import type { Agent } from "../types";

/** Read-only details of a shared / system agent the user cannot edit. */
export function AgentReadOnlyView({ agent, models }: { agent: Agent; models: CatalogModel[] }) {
  const { available } = useConnections();
  const model = models.find((item) => item.id === agent.defaultModelId);
  const tools = agent.tools.map((ref) => {
    const connection = available.find((item) => item.id === ref.connectionId);
    const tool = connection?.tools.find((item) => item.id === ref.toolId);
    return tool ? `${tool.name} (${connection?.name})` : null;
  }).filter((item): item is string => item !== null);

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <BackLink href="/agents">بازگشت به عامل‌ها</BackLink>
      <PageHeader title={agent.name} description="این عامل اشتراکی است و فقط ادمین می‌تواند آن را ویرایش کند." action={<Badge variant="secondary">فقط مشاهده</Badge>} />
      <dl className="grid gap-6 rounded-xl border p-5 md:grid-cols-2">
        <div className="flex flex-col gap-1 md:col-span-2">
          <dt className="text-label text-muted-foreground">کاربرد</dt>
          <dd className="text-body">{agent.purpose}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-label text-muted-foreground">مدل پیش‌فرض</dt>
          <dd className="text-body">{model?.name ?? "انتخاب خودکار"}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-label text-muted-foreground">نسخه</dt>
          <dd className="text-body">{agent.version}</dd>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <dt className="text-label text-muted-foreground">ابزارها</dt>
          <dd className="flex flex-wrap gap-2">
            {tools.length === 0 ? <span className="text-body text-muted-foreground">بدون ابزار</span> : tools.map((name) => <Badge key={name} variant="outline">{name}</Badge>)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
