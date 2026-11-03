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
import { useDataSources } from "../../hooks/use-data-sources";
import { canActivate } from "../../lib/selectors";
import type { DataSource } from "../../types";

/** Activation needs a successful test; deactivation asks first and keeps everything else. */
export function ActivationControls({ source }: { source: DataSource }) {
  const { setActive } = useDataSources();
  const [open, setOpen] = useState(false);

  if (!source.active) {
    const allowed = canActivate(source);
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          disabled={!allowed}
          onClick={() => {
            const result = setActive(source.id, true);
            if (result.ok) toast.success("اتصال فعال شد.");
            else toast.error(result.error);
          }}
        >
          فعال‌کردن
        </Button>
        {allowed ? null : (
          <p className="text-body-sm text-muted-foreground">
            برای فعال‌کردن، اول اتصال را آزمایش کنید و نتیجه موفق باشد.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          غیرفعال‌کردن
        </Button>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>اتصال «{source.name}» غیرفعال شود؟</AlertDialogTitle>
            <AlertDialogDescription>
              دستیار هوش تجاری دیگر از این انبار داده جواب نمی‌دهد. ساختار و دسترسی‌ها همان‌طور که هست می‌ماند.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                setActive(source.id, false);
                setOpen(false);
                toast.success("اتصال غیرفعال شد.");
              }}
            >
              غیرفعال‌کردن
            </Button>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
