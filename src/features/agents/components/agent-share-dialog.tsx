"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getShareTargetOptions } from "../data/agents";
import type { Agent } from "../types";
import { useAgents } from "./agents-provider";

type AgentShareDialogProps = { agent: Agent; open: boolean; onOpenChange: (open: boolean) => void };

/** Choose people or groups to share an Agent with; the request waits for the admin. */
export function AgentShareDialog({ agent, open, onOpenChange }: AgentShareDialogProps) {
  const { requestShare } = useAgents();
  const [chosen, setChosen] = useState<string[]>([]);
  const options = getShareTargetOptions();

  function submit() {
    requestShare(agent.id, options.filter((item) => chosen.includes(item.id)).map(({ kind, name }) => ({ kind, name })));
    toast.success(`درخواست اشتراک‌گذاری «${agent.name}» برای تأیید ادمین فرستاده شد.`);
    setChosen([]);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>درخواست اشتراک‌گذاری</DialogTitle>
          <DialogDescription>افراد یا گروه‌هایی را که باید به این Agent دسترسی داشته باشند انتخاب کنید. تا تأیید ادمین، Agent برای آن‌ها دیده نمی‌شود.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {options.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox id={`share-${agent.id}-${item.id}`} checked={chosen.includes(item.id)} onCheckedChange={(checked) => setChosen((list) => (checked === true ? [...list, item.id] : list.filter((id) => id !== item.id)))} />
              <Label htmlFor={`share-${agent.id}-${item.id}`}>{item.name} ({item.kind === "group" ? "گروه" : "فرد"})</Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
          <Button disabled={chosen.length === 0} onClick={submit}>ارسال درخواست</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
