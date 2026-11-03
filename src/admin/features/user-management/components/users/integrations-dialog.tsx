"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type IntegrationsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** The button exists, but no connection is made yet. */
export function IntegrationsDialog({ open, onOpenChange }: IntegrationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>اتصال به نرم‌افزارهای دیگر</DialogTitle>
          <DialogDescription>
            این امکان هنوز آماده نیست. فعلاً می‌توانید کاربران را به‌صورت دستی یا با
            فایل اکسل اضافه کنید.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>بستن</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
