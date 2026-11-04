"use client";

import Link from "@/components/shared/app-link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, Share2Icon, UsersRoundIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getConnectionById } from "@/features/connections/data/connections";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { formatDate } from "@/lib/format";
import { formatScore, formatVersion } from "../lib/version";
import type { Agent } from "../types";
import { AgentIcon } from "./agent-icon";
import { AgentShareDialog } from "./agent-share-dialog";

function toolNames(agent: Agent) {
  return agent.tools
    .map((ref) => getConnectionById(ref.connectionId)?.tools.find((tool) => tool.id === ref.toolId)?.name)
    .filter(Boolean)
    .join("، ");
}

/** The Kariz group an Agent fits, from what it does. */
function groupFor(agent: Agent): string {
  const text = `${agent.name} ${agent.purpose}`;
  if (/نگهداری|تعمیر/.test(text)) return "نگهداری";
  if (/تولید|شاخص|خط/.test(text)) return "تولید خط ۲";
  if (/فروش|قیمت/.test(text)) return "فروش";
  if (/تدارک|سفارش|خرید/.test(text)) return "تدارکات";
  return "کیفیت و فرمولاسیون";
}

export function AgentCard({ agent, readOnly = false }: { agent: Agent; readOnly?: boolean }) {
  const router = useRouter();
  const { modelById } = useModels();
  const [sharing, setSharing] = useState(false);
  const model = modelById(agent.defaultModelId);
  const internal = agent.isSensitive || agent.modelPolicy === "internal-only" || Boolean(model?.isInternal);
  const pending = agent.shareRequests.some((item) => item.status === "pending");

  function addToGroup() {
    const group = groupFor(agent);
    toast.success(`«${agent.name}» به گروه «${group}» در کاریز اضافه شد.`, {
      description: "اعضای گروه با @نام عامل صدایش می‌زنند.",
      action: { label: "رفتن به گروه‌ها", onClick: () => router.push("/messenger/groups") },
    });
  }

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="grid-cols-[auto_1fr] items-start gap-x-3">
        <AgentIcon name={agent.name} purpose={agent.purpose} className="row-span-2" />
        <CardTitle className="flex flex-wrap items-center gap-2">
          {agent.name}
          {!agent.isEnabled ? <Badge variant="destructive">غیرفعال</Badge> : pending ? <Badge variant="warning">در انتظار تأیید</Badge> : <Badge variant="success">فعال</Badge>}
        </CardTitle>
        <CardDescription className="line-clamp-2">{agent.purpose || "بدون توضیح"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 border-t pt-3 text-body-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={internal ? "success" : "info"}>{internal ? "🔒 داخلی" : "🌐 بیرونی"} · {model?.name ?? "—"}</Badge>
          <Badge variant="outline">نسخه {formatVersion(agent.version)}</Badge>
          {agent.evalScore !== undefined ? <Badge variant="secondary">✦ ارزیابی {formatScore(agent.evalScore)}</Badge> : null}
        </div>
        <div className="flex flex-col gap-0.5 text-muted-foreground">
          <span className="line-clamp-1">ابزارها: {toolNames(agent) || "بدون ابزار"}</span>
          <span>{agent.modelPolicy === "internal-only" ? "سیاست مدل: فقط داخلی" : "سیاست مدل: خودکار"} · ویرایش: {formatDate(agent.updatedAt)}</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={addToGroup}><UsersRoundIcon aria-hidden />افزودن به گروه کاریز</Button>
          {readOnly ? <Link href={`/agents/${agent.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>مشاهده</Link> : (
            <>
              <Tooltip>
                <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-sm" aria-label={`اشتراک‌گذاری ${agent.name}`} onClick={() => setSharing(true)} />}><Share2Icon aria-hidden /></TooltipTrigger>
                <TooltipContent>اشتراک‌گذاری</TooltipContent>
              </Tooltip>
              <Link href={`/agents/${agent.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}><PencilIcon aria-hidden />ویرایش</Link>
            </>
          )}
        </div>
      </CardContent>
      {readOnly ? null : <AgentShareDialog agent={agent} open={sharing} onOpenChange={setSharing} />}
    </Card>
  );
}
