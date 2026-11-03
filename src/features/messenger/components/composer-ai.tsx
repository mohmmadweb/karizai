"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AiAnswer } from "@/features/social/components/ai-answer";
import { AiButton } from "@/features/social/components/ai-button";
import { getThreadAi, improveText } from "../data/thread-ai";

type ComposerAiProps = { threadId: string; name: string; text: string; onUse: (text: string) => void };

/** «✦ پیشنهاد پاسخ» and «✦ بهبود متن» above the message box; «استفاده از این متن» puts the result in the box. */
export function ComposerAi({ threadId, name, text, onUse }: ComposerAiProps) {
  const [draft, setDraft] = useState<{ key: number; text: string } | null>(null);
  const firstName = name.split(" ")[0];
  return (
    <div className="flex flex-col gap-2">
      {draft ? (
        <AiAnswer key={draft.key}>
          <p className="whitespace-pre-wrap text-body">{draft.text}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => { onUse(draft.text); setDraft(null); }}>استفاده از این متن</Button>
            <Button size="sm" variant="ghost" onClick={() => setDraft(null)}>بستن</Button>
          </div>
        </AiAnswer>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <AiButton label="پیشنهاد پاسخ" size="xs" onClick={() => setDraft({ key: Date.now(), text: getThreadAi(threadId, name).reply })} />
        <AiButton label="بهبود متن" size="xs" disabled={!text.trim()} title={text.trim() ? undefined : "اول متنی بنویسید"} onClick={() => setDraft({ key: Date.now(), text: improveText(text, firstName) })} />
        <span className="self-center text-caption text-muted-foreground">با «@دستیار» از دستیار هوشمند بپرسید.</span>
      </div>
    </div>
  );
}
