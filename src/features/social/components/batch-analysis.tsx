"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { personName } from "@/features/workspace/lib/people";
import { batchAnalysis } from "../data/ai-answers";
import { useAskAssistant } from "../lib/use-ask-assistant";
import { AiActions, AiBullets, SourceChips } from "./ai-parts";

/** Root-cause analysis of the rejected batch, with the three follow-up actions of the mockup. */
export function BatchAnalysis() {
  const { addTask } = useWorkspace();
  const ask = useAskAssistant();
  const task = batchAnalysis.correctiveTask;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-label">تحلیل مردودی بچ {batchAnalysis.batch}</h3>
      <AiBullets items={batchAnalysis.facts} />
      <div className="flex flex-col gap-1">
        <h4 className="text-label">علت‌های محتمل، به ترتیب شواهد</h4>
        <AiBullets items={batchAnalysis.causes} />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-label">اقدام پیشنهادی</h4>
        <AiBullets items={batchAnalysis.actions} />
      </div>
      <SourceChips sources={batchAnalysis.sources} />
      <AiActions>
        <Button size="sm" onClick={() => { addTask(task.projectId, task.title, task.assigneeId, "high", { source: "quality-agent", dueDate: task.dueDate }); toast.success(`وظیفه‌ی اقدام اصلاحی برای ${personName(task.assigneeId)} ساخته شد`); }}>ساخت اقدام اصلاحی</Button>
        <Button size="sm" variant="outline" onClick={() => toast.success("تحلیل در گروه «کیفیت و فرمولاسیون» ارسال شد")}>ارسال به گروه</Button>
        <Button size="sm" variant="outline" onClick={() => ask(batchAnalysis.question, "agent-quality")}>ادامه با دستیار کیفیت</Button>
      </AiActions>
    </div>
  );
}
