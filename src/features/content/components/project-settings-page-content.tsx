"use client";

import { useState } from "react";
import { CreateButton, FilterPill, MotoPage, MotoPageHeader, MotoPagination, MotoSearch } from "@/components/shared/moto/moto";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/features/workspace/components/workspace-provider";
import { formatNumber } from "@/lib/format";
import { allPeople, personName, personRole } from "../lib/people";
import { useListView } from "../lib/use-list-view";
import { AuthorLine } from "./author-line";
import { ContentTable } from "./content-table";
import { FormDialog } from "./form-dialog";

const roles = [{ value: "manager", label: "مدیر پروژه" }, { value: "member", label: "عضو" }, { value: "viewer", label: "مشاهده‌گر" }];
type Row = { id: string; role: string };

export function ProjectSettingsPageContent() {
  const { projects, tasks } = useWorkspace();
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [members, setMembers] = useState<Record<string, Row[]>>(() => Object.fromEntries(projects.map((p) => [p.id, p.memberIds.map((id) => ({ id, role: id === p.ownerId ? "manager" : "member" }))])));
  const [adding, setAdding] = useState(false);
  const project = projects.find((p) => p.id === projectId);
  const rows = members[projectId] ?? [];
  const list = useListView(rows, (r) => personName(r.id), 8);
  const setRole = (id: string, role: string) => setMembers((m) => ({ ...m, [projectId]: m[projectId].map((r) => (r.id === id ? { ...r, role } : r)) }));
  const candidates = allPeople().filter((p) => !rows.some((r) => r.id === p.id));

  return (
    <MotoPage>
      <MotoPageHeader
        title="تنظیمات پروژه"
        description={project?.description}
        search={<MotoSearch value={list.query} onChange={list.setQuery} placeholder="جستجوی عضو" />}
        filters={<FilterPill label="پروژه" value={projectId} onChange={(v) => { setProjectId(v); list.setPage(1); }} options={projects.map((p) => ({ value: p.id, label: p.name }))} />}
        action={<CreateButton onClick={() => setAdding(true)}>افزودن عضو</CreateButton>}
      />
      <ContentTable rows={list.rows} total={list.total} rowKey={(r) => r.id} empty="عضوی یافت نشد" columns={[
        { head: "عضو", cell: (r) => <AuthorLine id={r.id} /> },
        { head: "سمت", cell: (r) => personRole(r.id) },
        { head: "وظایف باز", cell: (r) => formatNumber(tasks.filter((t) => t.projectId === projectId && t.assigneeId === r.id && t.status !== "done").length) },
        { head: "نقش در پروژه", cell: (r) => (
          <select aria-label={`نقش ${personName(r.id)}`} value={r.role} disabled={r.id === project?.ownerId} onChange={(e) => setRole(r.id, e.target.value)} className="h-9 rounded-lg border bg-background px-2 text-body-sm">
            {roles.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) },
        { head: "عملیات", cell: (r) => r.id === project?.ownerId ? <span className="text-caption text-muted-foreground">مالک پروژه</span> : <Button type="button" size="xs" variant="outline" onClick={() => setMembers((m) => ({ ...m, [projectId]: m[projectId].filter((x) => x.id !== r.id) }))}>حذف از پروژه</Button> },
      ]} />
      <MotoPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
      <FormDialog open={adding} onOpenChange={setAdding} title="افزودن عضو به پروژه" description={project?.name} submitLabel="افزودن" fields={[
        { name: "person", label: "همکار", kind: "select", options: candidates.length ? candidates.map((p) => ({ value: p.id, label: `${p.name} (${p.role})` })) : [{ value: "", label: "همه‌ی همکاران عضو هستند" }] },
        { name: "role", label: "نقش", kind: "select", options: roles, initial: "member" },
      ]} onSubmit={(v) => v.person && setMembers((m) => ({ ...m, [projectId]: [...m[projectId], { id: v.person, role: v.role }] }))} />
    </MotoPage>
  );
}
