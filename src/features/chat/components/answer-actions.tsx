"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, ClipboardCheckIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import type { AnswerAction } from "../types";

/** «ارسال به گروه» and «ساخت اقدام اصلاحی» under a root-cause answer. Both are temporary and reset on reload. */
export function AnswerActions({ actions }: { actions: AnswerAction[] }) {
  const router = useRouter();
  const { addTask } = useWorkspace();
  const [done, setDone] = useState<AnswerAction[]>([]);
  const finish = (action: AnswerAction) => setDone((list) => [...list, action]);

  function sendToGroup() {
    finish("send-to-group");
    toast.success("در گروه «کیفیت و فرمولاسیون» ارسال شد.", { action: { label: "دیدن گروه", onClick: () => router.push("/messenger/groups") } });
  }

  function correctiveAction() {
    addTask("proj-1", "اقدام اصلاحی بچ B-1405-2217: بچ آزمایشی با مستربچ قبلی و تنظیم دمای ناحیه‌ی ۴", "col-reza", "high");
    finish("corrective-action");
    toast.success("وظیفه‌ی اقدام اصلاحی برای رضا محمدی ساخته شد.", { description: "در پروژه‌ی «بهینه‌سازی خط ۲»", action: { label: "دیدن وظایف", onClick: () => router.push("/messenger/tasks") } });
  }

  return (
    <div data-ai className="flex flex-wrap gap-2">
      {actions.includes("send-to-group") ? (
        <Button type="button" size="sm" variant="soft" disabled={done.includes("send-to-group")} onClick={sendToGroup}>
          {done.includes("send-to-group") ? <CheckIcon aria-hidden /> : <SendIcon aria-hidden />}ارسال به گروه
        </Button>
      ) : null}
      {actions.includes("corrective-action") ? (
        <Button type="button" size="sm" variant="soft" disabled={done.includes("corrective-action")} onClick={correctiveAction}>
          {done.includes("corrective-action") ? <CheckIcon aria-hidden /> : <ClipboardCheckIcon aria-hidden />}ساخت اقدام اصلاحی
        </Button>
      ) : null}
    </div>
  );
}
