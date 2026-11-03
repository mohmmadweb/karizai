"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpIcon, LockIcon, MessageSquareShareIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/features/chat/components/chat-provider";
import { getQuickQuestions } from "../data/page-contexts";
import { AiAnswerView } from "./ai-answer-view";
import { useAiPanel } from "./ai-panel-provider";

/** «دستیار کاریز AI»: a side panel that knows the page it was opened on. Answers are prepared; no model is called. */
export function AiPanelSheet() {
  const router = useRouter();
  const { setPrefill } = useChat();
  const { open, setOpen, context, page, messages, ask } = useAiPanel();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const lastQuestion = [...messages].reverse().find((item) => item.role === "user");

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  function send() {
    const question = text.trim();
    if (!question) return;
    ask(question);
    setText("");
  }

  function continueInAssistant() {
    const question = text.trim() || (lastQuestion?.role === "user" ? lastQuestion.text : "");
    setPrefill(question);
    setOpen(false);
    router.push("/chat");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b pe-14">
          <SheetTitle className="flex items-center gap-2 text-h4">
            <span aria-hidden className="text-primary">✦</span>دستیار کاریز AI
            <Badge variant="success"><LockIcon aria-hidden />مدل داخلی</Badge>
          </SheetTitle>
          <SheetDescription>زمینه: {context}</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4" aria-live="polite">
          <div className="flex flex-wrap gap-2" role="group" aria-label="پرسش‌های سریع">
            {getQuickQuestions(page.key).map((question) => (
              <Button key={question} type="button" size="xs" variant="soft" onClick={() => ask(question)}>{question}</Button>
            ))}
          </div>
          {messages.map((message) =>
            message.role === "user" ? (
              <p key={message.id} className="max-w-[85%] self-end rounded-2xl bg-muted px-4 py-2 text-body-sm">{message.text}</p>
            ) : (
              <div key={message.id} className="flex flex-col gap-2 rounded-2xl border bg-card p-3">
                <span className="text-caption font-semibold text-primary">✦ کاریز AI · مدل داخلی</span>
                {message.answer ? <AiAnswerView answer={message.answer} /> : <Loader variant="typing" size="sm" />}
              </div>
            ),
          )}
          <div ref={endRef} />
        </div>
        <SheetFooter className="gap-3 border-t">
          <form
            className="flex items-end gap-2"
            onSubmit={(event) => { event.preventDefault(); send(); }}
          >
            <Textarea
              aria-label="پرسش از دستیار"
              placeholder="بپرسید…"
              value={text}
              rows={2}
              className="max-h-32 min-h-11 resize-none"
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); }
              }}
            />
            <Button type="submit" size="icon" className="shrink-0 rounded-full" aria-label="ارسال" disabled={!text.trim()}><ArrowUpIcon aria-hidden /></Button>
          </form>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={continueInAssistant}><MessageSquareShareIcon aria-hidden />ادامه در دستیار</Button>
            <span className="text-caption text-muted-foreground">همه پردازش‌ها روی سرورهای سازمان</span>
          </div>
          <p className="text-caption text-muted-foreground">پاسخ‌ها فقط از اطلاعاتی ساخته می‌شوند که شما به آن‌ها دسترسی دارید.</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
