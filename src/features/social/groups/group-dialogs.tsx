"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAgentMembers } from "../data/agents";

type Open = { open: boolean; onOpenChange: (open: boolean) => void };

/** «+ ایجاد گروه»: a name, a short description and, optionally, Agents that answer in it. */
export function CreateGroupDialog({ open, onOpenChange, onCreate }: Open & { onCreate: (name: string, description: string, agentIds: string[]) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [agents, setAgents] = useState<string[]>([]);
  const [error, setError] = useState(false);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return setError(true);
    onCreate(name.trim(), description.trim(), agents);
    setName(""); setDescription(""); setAgents([]); onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>گروه تازه</DialogTitle></DialogHeader>
        <form noValidate onSubmit={submit} className="grid gap-3">
          <Field data-invalid={error || undefined}>
            <FieldLabel htmlFor="grp-name">نام گروه</FieldLabel>
            <Input id="grp-name" value={name} onChange={(e) => { setName(e.target.value); setError(false); }} placeholder="مثلاً: پروژه‌ی خط ۳" aria-invalid={error} />
            {error ? <FieldError>نام گروه را بنویسید.</FieldError> : null}
          </Field>
          <Field><FieldLabel htmlFor="grp-desc">توضیح</FieldLabel><Input id="grp-desc" value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
          <AgentChecks chosen={agents} onChange={setAgents} />
          <Button type="submit" className="w-fit">ساخت گروه</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AgentChecks({ chosen, onChange, exclude = [] }: { chosen: string[]; onChange: (ids: string[]) => void; exclude?: string[] }) {
  const list = getAgentMembers().filter((agent) => !exclude.includes(agent.id));
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="pb-1 text-label">✦ عامل‌های هوشمند گروه</legend>
      {list.length === 0 ? <p className="text-body-sm text-muted-foreground">همه‌ی عامل‌ها عضو این گروه‌اند.</p> : list.map((agent) => (
        <div key={agent.id} className="flex items-center gap-2">
          <Checkbox id={`ag-${agent.id}`} checked={chosen.includes(agent.id)} onCheckedChange={(checked) => onChange(checked === true ? [...chosen, agent.id] : chosen.filter((id) => id !== agent.id))} />
          <Label htmlFor={`ag-${agent.id}`} className="font-normal">{agent.name} <span className="text-caption text-muted-foreground">({agent.handle})</span></Label>
        </div>
      ))}
    </fieldset>
  );
}

/** «افزودن عامل به گروه»: the Agent then answers in the group when called by its handle. */
export function AddAgentDialog({ open, onOpenChange, groupName, current, onAdd }: Open & { groupName: string; current: string[]; onAdd: (ids: string[]) => void }) {
  const [chosen, setChosen] = useState<string[]>([]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>افزودن عامل به گروه</DialogTitle><DialogDescription>عامل پیام‌های «{groupName}» را می‌خواند و وقتی با نامش صدا زده شود، با منبع جواب می‌دهد.</DialogDescription></DialogHeader>
        <AgentChecks chosen={chosen} onChange={setChosen} exclude={current} />
        <Button className="w-fit" disabled={chosen.length === 0} onClick={() => { onAdd(chosen); setChosen([]); onOpenChange(false); }}>افزودن</Button>
      </DialogContent>
    </Dialog>
  );
}
