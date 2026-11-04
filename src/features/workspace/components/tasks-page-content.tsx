"use client";

import { useState, type FormEvent } from "react";
import { PlusIcon, SettingsIcon } from "lucide-react";
import { RoundIconButton } from "@/components/shared/moto/moto";
import { FilterPill, MotoPage, MotoPageHeader, MotoSearch, StatusTabs } from "@/components/shared/moto/moto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiAnswer } from "@/features/social/components/ai-answer";
import { AiButton } from "@/features/social/components/ai-button";
import { currentUserId } from "../lib/people";
import { TodayPriorities } from "./today-priorities";
import { TaskList } from "./task-list";
import { useWorkspace } from "./workspace-provider";

/** The tasks of the current user (or of everyone), with a form to add one. New tasks stay until the page is reloaded. */
export function TasksPageContent() {
  const { projects, tasks, addTask } = useWorkspace();
  const [scope, setScope] = useState<"mine" | "all">("mine");
  const [title, setTitle] = useState("");
  const [prioritiesKey, setPrioritiesKey] = useState<number | null>(null);
  const [projectId, setProjectId] = useState(projects[0].id);
  const items = projects.map((p) => ({ value: p.id, label: p.name }));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "todo" | "doing" | "done">("all");
  const [newest, setNewest] = useState(true);
  const shown = tasks.filter((task) => (scope === "all" || task.assigneeId === currentUserId()) && (status === "all" || task.status === status) && (!query.trim() || task.title.includes(query.trim())));
  if (!newest) shown.reverse();

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    addTask(projectId, title.trim(), currentUserId());
    setTitle("");
    setScope("mine");
  }

  return (
    <MotoPage>
      <MotoPageHeader
        title="فعالیت و وظایف من"
        description="وظایف پروژه‌ها را ببینید و وضعیتشان را عوض کنید."
        tools={<RoundIconButton label="تنظیمات" icon={SettingsIcon} href="/settings" />}
        search={<MotoSearch value={query} onChange={setQuery} placeholder="جستجوی وظایف" />}
        filters={<FilterPill label="ترتیب" sort value={newest ? "new" : "old"} options={[{ value: "new", label: "جدیدترین" }, { value: "old", label: "قدیمی‌ترین" }]} onChange={(v) => setNewest(v === "new")} />}
        action={<AiButton label="اولویت‌بندی امروز من" size="default" onClick={() => setPrioritiesKey(Date.now())} />}
      />
      {prioritiesKey ? (
        <AiAnswer key={prioritiesKey}>
          <h2 className="text-label">ترتیب پیشنهادی کارهای امروز</h2>
          <TodayPriorities tasks={tasks.filter((task) => task.assigneeId === currentUserId())} projects={projects} />
        </AiAnswer>
      ) : null}
      <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
        <Input className="min-w-56 flex-1" name="task-title" autoComplete="off" aria-label="عنوان وظیفه‌ی تازه" placeholder="وظیفه‌ی تازه..." value={title} onChange={(e) => setTitle(e.target.value)} />
        <Select items={items} value={projectId} onValueChange={(v) => v && setProjectId(v)}>
          <SelectTrigger aria-label="پروژه" className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{items.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
        <Button type="submit" disabled={!title.trim()}><PlusIcon data-icon="inline-start" aria-hidden />افزودن</Button>
      </form>
      <div className="flex flex-wrap items-center gap-3">
        <StatusTabs label="نمایش وظایف" value={scope} onChange={setScope} options={[{ value: "mine", label: "وظایف من" }, { value: "all", label: "همه‌ی وظایف" }]} />
        <StatusTabs label="وضعیت وظیفه" value={status} onChange={setStatus} options={[{ value: "all", label: "همه" }, { value: "todo", label: "انجام‌نشده" }, { value: "doing", label: "در حال انجام" }, { value: "done", label: "انجام‌شده" }]} />
      </div>
      <TaskList tasks={shown} projects={projects} />
      <p className="text-body-sm text-muted-foreground"><span aria-hidden className="text-primary">✦ </span>وظایفی که عامل‌ها می‌سازند در همین بخش و با همان دسترسی‌ها مدیریت می‌شوند؛ اگر سازمان از GitLab یا MS Project استفاده کند، از درگاه «کار و وظایف» به همان‌جا می‌روند.</p>
    </MotoPage>
  );
}
