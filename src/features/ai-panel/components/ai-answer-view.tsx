"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, FileTextIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import type { AiAction, AiAnswer } from "../types";

/** A prepared answer: text, sources, and the actions under it. An action runs once. */
export function AiAnswerView({ answer }: { answer: AiAnswer }) {
  const router = useRouter();
  const { addTask } = useWorkspace();
  const [done, setDone] = useState<string[]>([]);

  function run(action: AiAction) {
    action.tasks?.forEach((task) => addTask(task.projectId, task.title, task.assigneeId, "high"));
    action.run?.();
    setDone((list) => [...list, action.label]);
    const link = action.link;
    toast.success(action.message, link ? { action: { label: link.label, onClick: () => router.push(link.href) } } : undefined);
  }

  return (
    <div className="flex flex-col gap-3">
      <Markdown className="chat-markdown text-body-sm">{answer.text}</Markdown>
      {answer.sources?.length ? (
        <ul className="flex flex-wrap gap-1.5" aria-label="منبع‌ها">
          {answer.sources.map((source) => (
            <li key={source}><Badge variant="outline"><FileTextIcon aria-hidden />{source}</Badge></li>
          ))}
        </ul>
      ) : null}
      {answer.actions?.length ? (
        <div className="flex flex-wrap gap-2">
          {answer.actions.map((action) => {
            const finished = done.includes(action.label);
            return (
              <Button key={action.label} type="button" size="xs" variant={action.primary ? "default" : "soft"} disabled={finished} onClick={() => run(action)}>
                {finished ? <CheckIcon aria-hidden /> : null}
                {action.label}
              </Button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
