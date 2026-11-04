"use client";

import { Button } from "@/components/ui/button";
import type { SchemaTemplate } from "../../types";

type Props = { templates: SchemaTemplate[]; chosenId: string | null; onChoose: (template: SchemaTemplate) => void };

/** Ready-made schemas as small buttons; choosing one fills the form below it. */
export function SchemaTemplatePicker({ templates, chosenId, onChoose }: Props) {
  if (templates.length === 0) return null;
  return (
    <div className="flex flex-col gap-2" role="group" aria-label="قالب‌های آماده">
      <span className="text-label text-foreground">قالب آماده</span>
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <Button key={template.id} type="button" variant={chosenId === template.id ? "default" : "outline"} className="min-h-10" aria-pressed={chosenId === template.id} onClick={() => onChoose(template)}>
            {template.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
