"use client";

import { useState, type FormEvent } from "react";
import { PlusIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentUserId } from "../lib/people";
import { TaskList } from "./task-list";
import { useWorkspace } from "./workspace-provider";

/** The tasks of the current user (or of everyone), with a form to add one. New tasks stay until the page is reloaded. */
export function TasksPageContent() {
  const { projects, tasks, addTask } = useWorkspace();
  const [scope, setScope] = useState<"mine" | "all">("mine");
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(projects[0].id);
  const items = projects.map((p) => ({ value: p.id, label: p.name }));
  const shown = tasks.filter((task) => scope === "all" || task.assigneeId === currentUserId());

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    addTask(projectId, title.trim(), currentUserId());
    setTitle("");
    setScope("mine");
  }

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="فعالیت و وظایف من" description="وظایف پروژه‌ها را ببینید و وضعیتشان را عوض کنید." />
      <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
        <Input className="min-w-56 flex-1" name="task-title" autoComplete="off" aria-label="عنوان وظیفه‌ی تازه" placeholder="وظیفه‌ی تازه..." value={title} onChange={(e) => setTitle(e.target.value)} />
        <Select items={items} value={projectId} onValueChange={(v) => v && setProjectId(v)}>
          <SelectTrigger aria-label="پروژه" className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{items.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
        <Button type="submit" disabled={!title.trim()}><PlusIcon data-icon="inline-start" aria-hidden />افزودن</Button>
      </form>
      <Tabs value={scope} onValueChange={(v) => setScope(v as "mine" | "all")}>
        <TabsList aria-label="نمایش وظایف"><TabsTrigger value="mine">وظایف من</TabsTrigger><TabsTrigger value="all">همه‌ی وظایف</TabsTrigger></TabsList>
      </Tabs>
      <TaskList tasks={shown} projects={projects} />
    </div>
  );
}
