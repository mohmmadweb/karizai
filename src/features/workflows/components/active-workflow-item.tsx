"use client";

import { useState } from "react";
import Link from "@/components/shared/app-link";
import { useRouter } from "next/navigation";
import { MoreVerticalIcon, PauseIcon, PencilIcon, PlayIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Workflow } from "../types";
import { useWorkflows } from "./workflows-provider";

type ActiveWorkflowItemProps = { workflow: Workflow; active: boolean; onNavigate?: () => void };

/** One active workflow in the sidebar: the name opens it, the menu runs, pauses, edits or deletes it. */
export function ActiveWorkflowItem({ workflow, active, onNavigate }: ActiveWorkflowItemProps) {
  const router = useRouter();
  const { run, setPaused, remove } = useWorkflows();
  const [deleting, setDeleting] = useState(false);

  function runNow() {
    run(workflow.id, "دستی");
    toast.info(`جریان «${workflow.name}» شروع شد.`, { action: { label: "مشاهده", onClick: () => router.push(`/workflows/${workflow.id}?tab=runs`) } });
  }

  return (
    <li className={cn("group flex items-center gap-1 rounded-lg pe-1 transition-colors hover:bg-muted", active && "bg-primary/10 dark:bg-primary/20")}>
      <Link href={`/workflows/${workflow.id}`} onClick={onNavigate} aria-current={active ? "page" : undefined} className="flex h-9 min-w-0 flex-1 items-center rounded-lg px-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <span className="truncate text-label">{workflow.name}</span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`گزینه‌های ${workflow.name}`} />}>
          <MoreVerticalIcon aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={runNow}><PlayIcon aria-hidden />اجرا</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/workflows/${workflow.id}`)}><PencilIcon aria-hidden />ویرایش</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPaused(workflow.id, true)}><PauseIcon aria-hidden />توقف</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setDeleting(true)}><Trash2Icon aria-hidden />حذف</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={deleting} onOpenChange={setDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف «{workflow.name}»؟</AlertDialogTitle>
            <AlertDialogDescription>این جریان و راه‌اندازهایش از فهرست شما پاک می‌شود و دیگر اجرا نمی‌شود. سابقه‌ی اجراهای قبلی برای ادمین می‌ماند.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => { remove(workflow.id); toast.success(`جریان «${workflow.name}» حذف شد.`); }}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
