"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckIcon, FolderIcon, FolderInputIcon, MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ChatProject, Conversation } from "../types";

type ConversationItemProps = {
  conversation: Conversation;
  active: boolean;
  onRename: (title: string) => void;
  onDelete: () => void;
  /** With projects given, the menu offers to move the conversation into one. */
  projects?: ChatProject[];
  onMove?: (projectId: string | null) => void;
  onNavigate?: () => void;
  /** Title only, as in the sidebar. */
  compact?: boolean;
};

export function ConversationItem({ conversation, active, onRename, onDelete, onNavigate, compact, projects = [], onMove }: ConversationItemProps) {
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [title, setTitle] = useState(conversation.title);
  const [error, setError] = useState<string | null>(null);

  function submitRename() {
    if (!title.trim()) {
      setError("نام گفتگو نمی‌تواند خالی باشد.");
      return;
    }
    onRename(title.trim());
    setRenaming(false);
  }

  return (
    <li className={cn("group flex items-center gap-1 rounded-lg pe-1 transition-colors hover:bg-muted", active && "bg-primary/10 dark:bg-primary/20")}>
      <Link href={`/chat/${conversation.id}`} onClick={onNavigate} aria-current={active ? "page" : undefined} className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-lg px-3 py-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <span className="truncate text-label">{conversation.title}</span>
        {compact ? null : <span className="text-caption text-muted-foreground">{formatDate(conversation.updatedAt)}</span>}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`گزینه‌های ${conversation.title}`} />}>
          <MoreVerticalIcon aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => { setTitle(conversation.title); setError(null); setRenaming(true); }}><PencilIcon aria-hidden />تغییر نام</DropdownMenuItem>
          {onMove && projects.length > 0 ? (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger><FolderInputIcon aria-hidden />انتقال به پروژه</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {projects.map((project) => (
                  <DropdownMenuItem key={project.id} onClick={() => onMove(project.id)}>
                    <FolderIcon aria-hidden />{project.name}{conversation.projectId === project.id ? <CheckIcon aria-hidden className="ms-auto" /> : null}
                  </DropdownMenuItem>
                ))}
                {conversation.projectId ? <DropdownMenuItem onClick={() => onMove(null)}>خارج کردن از پروژه</DropdownMenuItem> : null}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : null}
          <DropdownMenuItem variant="destructive" onClick={() => setDeleting(true)}><Trash2Icon aria-hidden />حذف</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={renaming} onOpenChange={setRenaming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغییر نام گفتگو</DialogTitle>
            <DialogDescription>نام تازه را بنویسید.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(event) => { event.preventDefault(); submitRename(); }} className="grid gap-4">
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor={`rename-${conversation.id}`}>نام گفتگو</FieldLabel>
              <Input id={`rename-${conversation.id}`} value={title} onChange={(event) => { setTitle(event.target.value); setError(null); }} aria-invalid={Boolean(error)} autoFocus />
              {error ? <FieldError>{error}</FieldError> : null}
            </Field>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRenaming(false)}>انصراف</Button>
              <Button type="submit">ذخیره</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleting} onOpenChange={setDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف «{conversation.title}»؟</AlertDialogTitle>
            <AlertDialogDescription>این گفتگو از فهرست شما حذف می‌شود. نسخه‌ی ثبت‌شده برای ادمین پاک نمی‌شود.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
