"use client";

import { useState, type FormEvent } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiAction } from "@/features/social/components/ai-dialog";
import { projectStatus } from "../lib/project-status";
import { addDays } from "../lib/today";
import { AllProjectsReport } from "./project-ai-actions";
import { ProjectCard } from "./project-card";
import { useWorkspace } from "./workspace-provider";

const dueItems = [{ value: "14", label: "دو هفته" }, { value: "30", label: "یک ماه" }, { value: "90", label: "سه ماه" }];

export function ProjectsPageContent() {
  const { projects, tasks, addProject } = useWorkspace();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("30");
  const rows = projects.map((project) => ({ project, status: projectStatus(project, tasks) }));

  function create(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    addProject(name.trim(), description.trim(), addDays(Number(due)));
    toast.success(`پروژه‌ی «${name.trim()}» ساخته شد`);
    setName(""); setDescription(""); setCreating(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="پروژه‌ها" description="پروژه‌های سازمان با پیشرفت، ریسک تأخیر، اعضا و موعد. روی هر پروژه بزنید تا وظایفش را ببینید." action={
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setCreating(true)}><PlusIcon data-icon="inline-start" aria-hidden />ایجاد پروژه</Button>
          <AiAction label="گزارش وضعیت همه‌ی پروژه‌ها" size="default" context="پروژه‌های من"><AllProjectsReport rows={rows} /></AiAction>
        </div>
      } />
      <ul className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => <li key={project.id} className="relative"><ProjectCard project={project} tasks={tasks} /></li>)}
      </ul>
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader><DialogTitle>پروژه‌ی تازه</DialogTitle></DialogHeader>
          <form onSubmit={create} className="grid gap-3">
            <Field><FieldLabel htmlFor="proj-name">نام پروژه</FieldLabel><Input id="proj-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: راه‌اندازی خط ۳" /></Field>
            <Field><FieldLabel htmlFor="proj-desc">هدف</FieldLabel><Input id="proj-desc" value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
            <Field><FieldLabel>موعد</FieldLabel>
              <Select items={dueItems} value={due} onValueChange={(v) => v && setDue(v)}><SelectTrigger aria-label="موعد" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{dueItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent></Select>
            </Field>
            <Button type="submit" className="w-fit" disabled={!name.trim()}>ساخت پروژه</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
