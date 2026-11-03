"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, FolderIcon, MoreVerticalIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ChatProject } from "../types";
import { useChat } from "./chat-provider";
import { ConversationList } from "./conversation-list";
import { ProjectNameDialog } from "./project-name-dialog";

type ProjectRowProps = { project: ChatProject; activeId: string | null; onNavigate?: () => void };

/** One project in the sidebar: folds open to its conversations; the plus starts a new conversation inside it. */
export function ProjectRow({ project, activeId, onNavigate }: ProjectRowProps) {
  const router = useRouter();
  const { state, renameProject, removeProject, setDraftProjectId } = useChat();
  const holdsActive = state.conversations.some((item) => item.id === activeId && item.projectId === project.id);
  const [open, setOpen] = useState(holdsActive);
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <li className="flex flex-col gap-0.5">
      <div className="group flex items-center gap-0.5 rounded-lg pe-1 transition-colors hover:bg-muted">
        <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-2 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <FolderIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="truncate text-label">{project.name}</span>
          <ChevronLeftIcon className={cn("size-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none", open && "-rotate-90")} aria-hidden />
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`گفتگوی تازه در ${project.name}`}
          onClick={() => { setDraftProjectId(project.id); router.push("/chat"); onNavigate?.(); }}
        >
          <PlusIcon aria-hidden />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`گزینه‌های ${project.name}`} />}><MoreVerticalIcon aria-hidden /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setRenaming(true)}><PencilIcon aria-hidden />تغییر نام</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setDeleting(true)}><Trash2Icon aria-hidden />حذف پروژه</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {open ? <div className="ps-3"><ConversationList activeId={activeId} onNavigate={onNavigate} projectId={project.id} /></div> : null}
      <ProjectNameDialog open={renaming} onOpenChange={setRenaming} title="تغییر نام پروژه" initialName={project.name} onSubmit={(name) => renameProject(project.id, name)} />
      <AlertDialog open={deleting} onOpenChange={setDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف پروژه‌ی «{project.name}»؟</AlertDialogTitle>
            <AlertDialogDescription>فقط پروژه حذف می‌شود؛ گفتگوهایش می‌مانند و به فهرست گفتگوهای اخیر برمی‌گردند.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => removeProject(project.id)}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
