"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "../types";

type StatusToggleProps = {
  /** «کاربر» or «گروه», used in the confirmation text. */
  noun: string;
  name: string;
  active: boolean;
  /** What happens to the item after deactivation, shown in the dialog. */
  consequence: string;
  /** Why deactivation is not allowed, shown next to the disabled button. */
  blockedReason?: string;
  onChange: (active: boolean) => ActionResult;
};

/** Deactivate (with confirmation) or reactivate. Nothing is ever deleted. */
export function StatusToggle({
  noun,
  name,
  active,
  consequence,
  blockedReason,
  onChange,
}: StatusToggleProps) {
  const [open, setOpen] = useState(false);

  function apply(next: boolean) {
    const result = onChange(next);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(next ? `${noun} فعال شد.` : `${noun} غیرفعال شد.`);
  }

  if (!active) {
    return (
      <Button variant="outline" onClick={() => apply(true)}>
        فعال‌کردن {noun}
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        variant="destructive"
        disabled={Boolean(blockedReason)}
        onClick={() => setOpen(true)}
      >
        غیرفعال‌کردن {noun}
      </Button>
      {blockedReason ? (
        <p className="text-body-sm text-muted-foreground">{blockedReason}</p>
      ) : null}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {noun} «{name}» غیرفعال شود؟
            </AlertDialogTitle>
            <AlertDialogDescription>{consequence}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                apply(false);
                setOpen(false);
              }}
            >
              غیرفعال‌کردن
            </Button>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
