"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getTemplates } from "../data/templates";
import { describeTrigger } from "../lib/describe-trigger";
import { generateFromText } from "../lib/generate-from-text";
import type { WorkflowTemplate } from "../types";
import { useWorkflows } from "./workflows-provider";

type NewWorkflowDialogProps = { open: boolean; onOpenChange: (open: boolean) => void };

/** Start from a ready template, from a sentence, or from nothing. */
export function NewWorkflowDialog({ open, onOpenChange }: NewWorkflowDialogProps) {
  const router = useRouter();
  const { create } = useWorkflows();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function start(template: Pick<WorkflowTemplate, "name" | "description" | "triggers" | "nodes" | "edges">) {
    const id = create(template);
    onOpenChange(false);
    router.push(`/workflows/${id}`);
  }

  function generate() {
    if (text.trim().length < 8) {
      setError("کار را دست‌کم در یک جمله‌ی کوتاه بنویسید.");
      return;
    }
    start(generateFromText(text));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>کار تازه</DialogTitle>
          <DialogDescription>از یک قالب آماده شروع کنید، کار را با یک جمله توضیح دهید، یا از صفحه‌ی خالی شروع کنید. همه‌چیز بعد از ساخت قابل ویرایش است.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="templates">
          <TabsList>
            <TabsTrigger value="templates">قالب آماده</TabsTrigger>
            <TabsTrigger value="text">با توضیح</TabsTrigger>
          </TabsList>
          <TabsContent value="templates" className="flex flex-col gap-2 pt-3">
            {getTemplates().map((template) => (
              <button key={template.id} type="button" onClick={() => start(template)} className="flex flex-col gap-1 rounded-lg border p-3 text-start outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
                <span className="text-label">{template.name}</span>
                <span className="text-body-sm text-muted-foreground">{template.description}</span>
                <span className="text-caption text-muted-foreground">{template.triggers.map(describeTrigger).join("، ")}</span>
              </button>
            ))}
            <Button type="button" variant="outline" className="w-fit" onClick={() => start({ name: "کار تازه", description: "", triggers: [{ kind: "manual" }], nodes: [], edges: [] })}>
              شروع از صفحه‌ی خالی
            </Button>
          </TabsContent>
          <TabsContent value="text" className="pt-3">
            <form noValidate onSubmit={(event) => { event.preventDefault(); generate(); }} className="grid gap-3">
              <Field data-invalid={error ? true : undefined}>
                <FieldLabel htmlFor="workflow-text">کار را توضیح دهید</FieldLabel>
                <Textarea id="workflow-text" rows={4} value={text} onChange={(event) => { setText(event.target.value); setError(null); }} placeholder="مثلاً: هر هفته گزارش فروش را بساز و برای مدیر بفرست" aria-invalid={Boolean(error)} />
                {error ? <FieldError>{error}</FieldError> : <FieldDescription>یک پیش‌نویس ساخته می‌شود که می‌توانید در بوم ویرایش کنید.</FieldDescription>}
              </Field>
              <Button type="submit" className="w-fit"><SparklesIcon aria-hidden />ساخت پیش‌نویس</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
