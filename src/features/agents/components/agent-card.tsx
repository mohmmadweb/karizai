import Link from "next/link";
import { useState } from "react";
import { PencilIcon, Share2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getConnectionById } from "@/features/connections/data/connections";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { formatDate } from "@/lib/format";
import type { Agent } from "../types";
import { AgentIcon } from "./agent-icon";
import { AgentShareDialog } from "./agent-share-dialog";

function toolNames(agent: Agent) {
  return agent.tools
    .map((ref) => getConnectionById(ref.connectionId)?.tools.find((tool) => tool.id === ref.toolId)?.name)
    .filter(Boolean)
    .join("، ");
}

export function AgentCard({ agent, readOnly = false }: { agent: Agent; readOnly?: boolean }) {
  const { modelById } = useModels();
  const [sharing, setSharing] = useState(false);
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="grid-cols-[auto_1fr] items-start gap-x-3">
        <AgentIcon name={agent.name} purpose={agent.purpose} className="row-span-2" />
        <CardTitle className="flex flex-wrap items-center gap-2">
          {agent.name}
          {!agent.isEnabled ? <Badge variant="destructive">غیرفعال</Badge> : null}
        </CardTitle>
        <CardDescription className="line-clamp-2">{agent.purpose || "بدون توضیح"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 border-t pt-3 text-body-sm">
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <span>مدل: {modelById(agent.defaultModelId)?.name ?? "—"}</span>
          <span>· ویرایش: {formatDate(agent.updatedAt)}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {readOnly ? <span className="text-muted-foreground">ابزارها: {toolNames(agent) || "بدون ابزار"}</span> : <span />}
          {readOnly ? null : (
            <span className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-sm" aria-label={`اشتراک‌گذاری ${agent.name}`} onClick={() => setSharing(true)} />}><Share2Icon aria-hidden /></TooltipTrigger>
                <TooltipContent>اشتراک‌گذاری</TooltipContent>
              </Tooltip>
              <Link href={`/agents/${agent.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}><PencilIcon aria-hidden />ویرایش</Link>
            </span>
          )}
        </div>
      </CardContent>
      {readOnly ? null : <AgentShareDialog agent={agent} open={sharing} onOpenChange={setSharing} />}
    </Card>
  );
}
