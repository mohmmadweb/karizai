"use client";

import { Button } from "@/components/ui/button";
import { useState, type FormEvent } from "react";
import { SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { CreateButton, DashedEmpty, FilterPill, MotoPage, MotoPageHeader, MotoSearch, RoundIconButton } from "@/components/shared/moto/moto";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiAction } from "@/features/social/components/ai-dialog";
import { projectStatus } from "../lib/project-status";
import { addDays, daysFromToday } from "../lib/today";
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
  const [query, setQuery] = useState("");
  const [state, setState] = useState<"all" | "running" | "late" | "done">("all");
  const [newest, setNewest] = useState(true);
  const rows = projects.map((project) => ({ project, status: projectStatus(project, tasks) }));

  const shown = projects.filter((project) => {
    const percent = projectStatus(project, tasks).percent;
    const fits = state === "all" || (state === "done" ? percent === 100 : state === "late" ? percent < 100 && daysFromToday(project.dueDate) < 0 : percent < 100 && daysFromToday(project.dueDate) >= 0);
    return fits && (!query.trim() || `${project.name} ${project.description}`.includes(query.trim()));
  });
  if (!newest) shown.reverse();

  function create(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    addProject(name.trim(), description.trim(), addDays(Number(due)));
    toast.success(`پروژه‌ی «${name.trim()}» ساخته شد`);
    setName(""); setDescription(""); setCreating(false);
  }

  return (
    <MotoPage>
      <MotoPageHeader
        title="پروژه‌ها"
        description="پروژه‌های سازمان با پیشرفت، ریسک تأخیر، اعضا و موعد. روی هر پروژه بزنید تا وظایفش را ببینید."
        tools={<RoundIconButton label="تنظیمات" icon={SettingsIcon} href="/settings" />}
        search={<MotoSearch value={query} onChange={setQuery} placeholder="جستجوی پروژه‌ها" />}
        filters={<>
          <FilterPill label="وضعیت" value={state} options={[{ value: "all", label: "همه وضعیت‌ها" }, { value: "running", label: "در جریان" }, { value: "late", label: "دارای تأخیر" }, { value: "done", label: "تکمیل‌شده" }]} onChange={setState} />
          <FilterPill label="ترتیب" sort value={newest ? "new" : "old"} options={[{ value: "new", label: "جدیدترین" }, { value: "old", label: "قدیمی‌ترین" }]} onChange={(v) => setNewest(v === "new")} />
        </>}
        action={<>
          <AiAction label="گزارش وضعیت همه‌ی پروژه‌ها" size="default" context="پروژه‌های من"><AllProjectsReport rows={rows} /></AiAction>
          <CreateButton onClick={() => setCreating(true)}>ایجاد پروژه</CreateButton>
        </>}
      />
      {shown.length === 0 ? <DashedEmpty title="پروژه‌ای پیدا نشد" /> : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((project) => <li key={project.id} className="min-w-0"><ProjectCard project={project} tasks={tasks} /></li>)}
        </ul>
      )}
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
    </MotoPage>
  );
}
