import Link from "next/link";
import { PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getConnectionById } from "@/features/connections/data/connections";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { formatDate } from "@/lib/format";
import type { Agent } from "../types";
import { ShareStatusBadge } from "./share-status";

function toolNames(agent: Agent) {
  return agent.tools
    .map((ref) => getConnectionById(ref.connectionId)?.tools.find((tool) => tool.id === ref.toolId)?.name)
    .filter(Boolean)
    .join("، ");
}

export function AgentCard({ agent, readOnly = false }: { agent: Agent; readOnly?: boolean }) {
  const { modelById } = useModels();
  const latest = agent.shareRequests[0];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          {agent.name}
          {agent.isSensitive ? <Badge variant="warning">حساس</Badge> : null}
          {!agent.isEnabled ? <Badge variant="destructive">غیرفعال</Badge> : null}
        </CardTitle>
        <CardDescription>{agent.purpose || "بدون توضیح"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-body-sm">
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <span>مدل: {modelById(agent.defaultModelId)?.name ?? "—"}</span>
          <span>· ویرایش: {formatDate(agent.updatedAt)}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {readOnly ? <span className="text-muted-foreground">ابزارها: {toolNames(agent) || "بدون ابزار"}</span> : latest ? <span className="flex items-center gap-2">اشتراک: <ShareStatusBadge status={latest.status} /></span> : <span className="text-muted-foreground">فقط برای شما</span>}
          {readOnly ? null : <Link href={`/agents/${agent.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}><PencilIcon aria-hidden />ویرایش</Link>}
        </div>
      </CardContent>
    </Card>
  );
}
