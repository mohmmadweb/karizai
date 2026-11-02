"use client";

import { CheckIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentIcon } from "@/features/agents/components/agent-icon";
import { getConnectionById } from "@/features/connections/data/connections";
import { formatNumber } from "@/lib/format";
import type { RepositoryAgent } from "../types";

function toolNames(agent: RepositoryAgent) {
  return agent.tools
    .map((ref) => getConnectionById(ref.connectionId)?.tools.find((tool) => tool.id === ref.toolId)?.name)
    .filter(Boolean)
    .join("، ");
}

type RepositoryAgentCardProps = { agent: RepositoryAgent; added: boolean; onAdd: () => void };

export function RepositoryAgentCard({ agent, added, onAdd }: RepositoryAgentCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="grid-cols-[auto_1fr] items-start gap-x-3">
        <AgentIcon name={agent.name} purpose={agent.purpose} className="row-span-2" />
        <CardTitle className="flex flex-wrap items-center gap-2">{agent.name}<Badge variant="secondary">{agent.category}</Badge></CardTitle>
        <CardDescription className="line-clamp-2">{agent.purpose}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 border-t pt-3 text-body-sm">
        <p className="text-muted-foreground">ابزارها: {toolNames(agent) || "بدون ابزار"}</p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-muted-foreground">{agent.author} · {formatNumber(agent.usage)} استفاده</span>
          <Button size="sm" variant={added ? "ghost" : "outline"} disabled={added} onClick={onAdd}>
            {added ? <CheckIcon aria-hidden /> : <PlusIcon aria-hidden />}
            {added ? "در عامل‌های من" : "افزودن به عامل‌های من"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
