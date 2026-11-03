"use client";

import { useState } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getShareTargetOptions } from "../data/agents";
import type { ShareTarget } from "../types";

type AgentSubmitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  /** Saves the Agent and sends the request; the admin sees it in the approval queue. */
  onSubmit: (target: ShareTarget) => void;
};

/** «ارسال برای تأیید»: who should get the Agent once the admin approves it. */
export function AgentSubmitDialog({ open, onOpenChange, busy, onSubmit }: AgentSubmitDialogProps) {
  const groups = getShareTargetOptions().filter((item) => item.kind === "group");
  const [chosen, setChosen] = useState(groups[0]?.id ?? "");
  const target = groups.find((item) => item.id === chosen);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ارسال برای تأیید</DialogTitle>
          <DialogDescription>Agent همین حالا برای خود شما کار می‌کند. پس از تأیید ادمین، برای گروهی که انتخاب می‌کنید هم در دسترس قرار می‌گیرد.</DialogDescription>
        </DialogHeader>
        <RadioGroup value={chosen} onValueChange={(value) => setChosen(String(value))} aria-label="دسترسی">
          {groups.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <RadioGroupItem id={`submit-${item.id}`} value={item.id} />
              <Label htmlFor={`submit-${item.id}`}>{item.name}</Label>
            </div>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button loading={busy} disabled={!target} onClick={() => target && onSubmit({ kind: target.kind, name: target.name })}><SendIcon aria-hidden className="rtl:-scale-x-100" />ذخیره و ارسال</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
