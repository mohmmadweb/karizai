"use client";

import { AiAction } from "@/features/social/components/ai-dialog";
import { AiBullets } from "@/features/social/components/ai-parts";
import { SuggestedTasks } from "@/features/social/components/suggested-tasks";
import { getThreadAi } from "../data/thread-ai";
import { useMessenger } from "./messenger-provider";

/** «✦ خلاصه گفتگو» and «✦ تبدیل به وظیفه» in the header of a colleague chat. */
export function ThreadAiActions({ threadId, name }: { threadId: string; name: string }) {
  const { lastOf } = useMessenger();
  const ai = getThreadAi(threadId, name, lastOf(threadId)?.text);
  return (
    <div className="ms-auto flex shrink-0 flex-wrap gap-2">
      <AiAction label="خلاصه‌ی گفتگو" context={`گفتگو با ${name}`}><AiBullets items={ai.summary} /></AiAction>
      <AiAction label="تبدیل به وظیفه" context={`گفتگو با ${name}`}>
        {(close) => <SuggestedTasks tasks={[ai.task]} source="conversation" addAllLabel="افزودن به وظایف" doneMessage="وظیفه در «فعالیت و وظایف من» ثبت شد" onAdded={close} />}
      </AiAction>
    </div>
  );
}
