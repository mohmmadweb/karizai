"use client";

import { useState } from "react";
import { Share2Icon } from "lucide-react";
import { FormSection } from "@/components/shared/form-section";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getShareTargetOptions } from "../data/agents";
import type { Agent } from "../types";
import { useAgents } from "./agents-provider";
import { ShareRequestRow } from "./share-status";

/** Personal use is immediate; sharing with others needs the admin's approval. */
export function AgentShareSection({ agent }: { agent: Agent }) {
  const { requestShare } = useAgents();
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<string[]>([]);
  const options = getShareTargetOptions();

  function submit() {
    requestShare(agent.id, options.filter((item) => chosen.includes(item.id)).map(({ kind, name }) => ({ kind, name })));
    setChosen([]);
    setOpen(false);
  }

  return (
    <FormSection title="اشتراک‌گذاری" description="این Agent همین حالا برای خود شما قابل استفاده است. برای دیگران باید ادمین تأیید کند.">
      <div className="flex flex-col gap-3 md:col-span-2">
        {agent.shareRequests.length === 0 ? <p className="text-body text-muted-foreground">هنوز درخواستی نداده‌اید.</p> : <ul className="flex flex-col gap-2">{agent.shareRequests.map((item) => <ShareRequestRow key={item.id} request={item} />)}</ul>}
        <Button type="button" variant="outline" className="w-fit" onClick={() => setOpen(true)}><Share2Icon aria-hidden />درخواست اشتراک‌گذاری</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>درخواست اشتراک‌گذاری</DialogTitle>
            <DialogDescription>افراد یا گروه‌هایی را که باید به این Agent دسترسی داشته باشند انتخاب کنید. تا تأیید ادمین، Agent برای آن‌ها دیده نمی‌شود.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {options.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Checkbox id={`share-${item.id}`} checked={chosen.includes(item.id)} onCheckedChange={(checked) => setChosen((list) => (checked === true ? [...list, item.id] : list.filter((id) => id !== item.id)))} />
                <Label htmlFor={`share-${item.id}`}>{item.name} ({item.kind === "group" ? "گروه" : "فرد"})</Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>انصراف</Button>
            <Button disabled={chosen.length === 0} onClick={submit}>ارسال درخواست</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormSection>
  );
}
