"use client";

import { useState } from "react";
import { useAgents } from "@/features/agents/components/agents-provider";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import { describeTrigger } from "@/features/workflows/lib/describe-trigger";
import { currentUserName, getLocalRequests, requesterOf, skillConditions } from "../data/approval-samples";
import type { ApprovalItem, LocalRequest } from "../types";

const percent = (n: number) => `${Math.round(n * 100).toLocaleString("fa-IR")}٪`;

/** One queue from the shared Agents and workflows state plus the requests kept on this page. */
export function useApprovalQueue(): ApprovalItem[] {
  const { agents, skills, decideShare, decideSkill } = useAgents();
  const { workflows, decideActivation } = useWorkflows();
  const [local, setLocal] = useState<LocalRequest[]>(getLocalRequests);
  const drop = (key: string) => setLocal((list) => list.filter((r) => r.key !== key));

  const shares: ApprovalItem[] = agents.flatMap((agent) =>
    agent.shareRequests
      .filter((share) => share.status === "pending")
      .map((share) => ({
        key: `share-${agent.id}-${share.id}`,
        type: "agent" as const,
        title: agent.name + (agent.version ? ` (نسخه‌ی ${agent.version.replace(".", "٫").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])})` : ""),
        requester: agent.kind === "personal" ? currentUserName : "واحد فناوری",
        ask: `اشتراک با ${share.targets.map((t) => (t.kind === "group" ? `گروه ${t.name}` : t.name)).join("، ")}`,
        conditions: [
          agent.evalScore !== undefined ? `ارزیابی ${percent(agent.evalScore)} ✦` : "هنوز ارزیابی نشده",
          agent.isSensitive || agent.modelPolicy === "internal-only" ? "فقط مدل داخلی" : "مدل بیرونی با پوشاندن",
          `${agent.tools.length.toLocaleString("fa-IR")} ابزار`,
        ],
        requestedAt: share.requestedAt,
        decide: (approved: boolean, reason?: string) => decideShare(agent.id, share.id, approved, reason),
      })),
  );

  const skillItems: ApprovalItem[] = skills
    .filter((s) => s.approval === "pending" || s.pendingEdit)
    .map((s) => ({
      key: `skill-${s.id}`,
      type: "skill" as const,
      title: s.pendingEdit?.name ?? s.name,
      requester: requesterOf[s.id] ?? currentUserName,
      ask: s.pendingEdit ? "ویرایش مهارتی که الان فعال است" : "افزودن مهارت تازه",
      conditions: skillConditions[s.id] ?? ["دستورالعمل بررسی شود"],
      decide: (approved: boolean, reason?: string) => decideSkill(s.id, approved, reason),
    }));

  const flowItems: ApprovalItem[] = workflows
    .filter((w) => w.status === "pending-approval")
    .map((w) => ({
      key: `wf-${w.id}`,
      type: "workflow" as const,
      title: w.name,
      requester: requesterOf[w.id] ?? currentUserName,
      ask: "فعال‌سازی اجرای خودکار بدون حضور کاربر",
      conditions: [...w.triggers.filter((t) => t.kind !== "manual").map(describeTrigger), `${w.nodes.length.toLocaleString("fa-IR")} گام`],
      requestedAt: w.updatedAt,
      decide: (approved: boolean) => decideActivation(w.id, approved),
    }));

  const localItems: ApprovalItem[] = local.map((r) => ({ ...r, decide: () => drop(r.key) }));
  return [...shares, ...localItems.filter((i) => i.type === "agent"), ...skillItems, ...flowItems, ...localItems.filter((i) => i.type === "connection")];
}
