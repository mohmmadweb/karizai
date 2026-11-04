"use client";

import { useState } from "react";
import { Share2Icon } from "lucide-react";
import { FormSection } from "@/components/shared/form-section";
import { Button } from "@/components/ui/button";
import type { Agent } from "../types";
import { AgentShareDialog } from "./agent-share-dialog";
import { ShareRequestRow } from "./share-status";

/** Personal use is immediate; sharing with others needs the admin's approval. */
export function AgentShareSection({ agent }: { agent: Agent }) {
  const [open, setOpen] = useState(false);
  return (
    <FormSection title="اشتراک‌گذاری" description="این عامل همین حالا برای خود شما قابل استفاده است. برای دیگران باید ادمین تأیید کند.">
      <div className="flex flex-col gap-3 md:col-span-2">
        {agent.shareRequests.length === 0 ? <p className="text-body text-muted-foreground">هنوز درخواستی نداده‌اید.</p> : <ul className="flex flex-col gap-2">{agent.shareRequests.map((item) => <ShareRequestRow key={item.id} request={item} />)}</ul>}
        <Button type="button" variant="outline" className="w-fit" onClick={() => setOpen(true)}><Share2Icon aria-hidden />درخواست اشتراک‌گذاری</Button>
      </div>
      <AgentShareDialog agent={agent} open={open} onOpenChange={setOpen} />
    </FormSection>
  );
}
