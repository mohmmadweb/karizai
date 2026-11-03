"use client";

import { useEffect, useRef } from "react";
import { useMessenger } from "@/features/messenger/components/messenger-provider";
import { useWorkflows } from "./workflows-provider";

/** The step that drafts the purchase order in Rahkaran (connection conn-3, tool tool-60). */
const purchaseOrderToolId = "tool-60";

/**
 * Watches the runs of this visit. When a reorder run has drafted the purchase
 * order in Rahkaran, the alert bot tells the user about the shortage (once per
 * run). The task for «وظایف من» comes from the task step of the same workflow
 * (see `WorkspaceProvider`). Must be mounted inside MessengerProvider.
 */
export function RunNotifier() {
  const { runs, workflows } = useWorkflows();
  const messenger = useMessenger();
  const posted = useRef(new Set<string>());

  useEffect(() => {
    if (typeof messenger.postAlert !== "function") return;
    for (const run of runs) {
      if (!run.id.startsWith("run-new-") || posted.current.has(run.id)) continue;
      const workflow = workflows.find((item) => item.id === run.workflowId);
      const poNode = workflow?.nodes.find((node) => node.kind === "tool" && node.config.toolId === purchaseOrderToolId);
      if (!workflow || !poNode || run.steps.find((step) => step.nodeId === poNode.id)?.status !== "succeeded") continue;
      posted.current.add(run.id);
      const material = poNode.config.params?.material || "PE سنگین HD5502";
      messenger.postAlert({
        title: "کمبود موجودی مواد اولیه",
        text: `کمبود موجودی: ${material} در انبار مرکزی ۱۸ تن است؛ نقطه‌ی سفارش ۴۰ تن. پیش‌نویس سفارش خرید PO-1405-0871 در راهکاران آماده است.`,
        workflowId: workflow.id,
        runId: run.id,
        tone: "warning",
        fields: [
          { label: "موجودی فعلی", value: "۱۸ تن (پوشش ۳ روز)" },
          { label: "نقطه‌ی سفارش", value: "۴۰ تن" },
          { label: "پیش‌نویس سفارش", value: `PO-1405-0871 · ${(Number(poNode.config.params?.quantityTon) || 80).toLocaleString("fa-IR")} تن از ${poNode.config.params?.vendor || "پلیمر خزر"}` },
          { label: "وظیفه‌ی شما", value: "بازبینی و تأیید پیش‌نویس در «وظایف من» ثبت شد" },
        ],
      });
    }
  }, [runs, workflows, messenger]);

  return null;
}
