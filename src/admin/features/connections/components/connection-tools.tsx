"use client";

import { useState } from "react";
import { PlusIcon, Trash2Icon, WrenchIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { DefinedTool } from "@/lib/connections";

type ConnectionToolsProps = { tools: DefinedTool[]; onChange: (tools: DefinedTool[]) => void };

/** The things the assistant may do through this connection. Each can ask the user before it runs. */
export function ConnectionTools({ tools, onChange }: ConnectionToolsProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function add() {
    if (!name.trim()) return setError("نام ابزار را بنویسید.");
    if (tools.some((tool) => tool.name.trim() === name.trim())) return setError("ابزاری با این نام هست.");
    onChange([...tools, { id: `tool-${Date.now().toString(36)}-${tools.length}`, name: name.trim(), description: description.trim(), requiresApproval: false }]);
    setName("");
    setDescription("");
  }

  return (
    <div className="flex flex-col gap-4">
      <form noValidate onSubmit={(event) => { event.preventDefault(); add(); }} className="grid gap-3 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="tool-name">نام ابزار</FieldLabel>
          <Input id="tool-name" value={name} onChange={(event) => { setName(event.target.value); setError(null); }} aria-invalid={Boolean(error)} placeholder="مثلاً جست‌وجوی مشتری" />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="tool-description">کاربرد ابزار</FieldLabel>
          <Input id="tool-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="این ابزار چه کاری می‌کند؟" />
        </Field>
        <Button type="submit" variant="outline"><PlusIcon aria-hidden />افزودن ابزار</Button>
      </form>
      {tools.length === 0 ? (
        <EmptyState icon={<WrenchIcon />} title="این اتصال هنوز ابزاری ندارد" description="بدون ابزار، کاربران کاری با این اتصال نمی‌توانند بکنند." />
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
          {tools.map((tool) => (
            <li key={tool.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
              <div className="flex min-w-0 flex-col">
                <span className="font-medium">{tool.name}</span>
                {tool.description ? <span className="text-body-sm text-muted-foreground">{tool.description}</span> : null}
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-body-sm">
                  <Switch size="sm" checked={tool.requiresApproval} onCheckedChange={(checked) => onChange(tools.map((item) => (item.id === tool.id ? { ...item, requiresApproval: checked } : item)))} aria-label={`نیازمند تأیید کاربر: ${tool.name}`} />
                  نیازمند تأیید کاربر
                </label>
                <label className="flex items-center gap-2 text-body-sm">
                  <Switch size="sm" checked={Boolean(tool.writes)} onCheckedChange={(checked) => onChange(tools.map((item) => (item.id === tool.id ? { ...item, writes: checked } : item)))} aria-label={`این ابزار چیزی را تغییر می‌دهد: ${tool.name}`} />
                  تغییر می‌دهد
                </label>
                <Button variant="ghost" size="icon-sm" aria-label={`حذف ${tool.name}`} onClick={() => onChange(tools.filter((item) => item.id !== tool.id))}><Trash2Icon aria-hidden /></Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
