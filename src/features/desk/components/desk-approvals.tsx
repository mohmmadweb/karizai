"use client";

import { useState } from "react";
import Link from "next/link";
import { PackageIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeskPanel } from "./desk-panel";

type Approval = { id: string; title: string; detail: string; flowId: string };

const initial: Approval[] = [
  { id: "apr-1", title: "کالا نیازمند سفارش مجدد است", detail: "جریان «سفارش‌دهی خودکار مواد اولیه» · PE سنگین HD5502 · موجودی ۱۸ تن · پیشنهاد ۸۰ تن · حدود ۶٬۵۶۰ میلیون تومان", flowId: "wf-6" },
];

/** How many decisions wait at the start; the desk summary mentions them. */
export const pendingApprovalCount = initial.length;

/** What waits for my decision. Deciding is temporary: the list resets on reload. */
export function DeskApprovals() {
  const [items, setItems] = useState(initial);
  const decide = (item: Approval, approved: boolean) => {
    setItems((list) => list.filter((entry) => entry.id !== item.id));
    toast.success(approved ? "تأیید شد" : "رد شد", { description: item.title });
  };
  return (
    <DeskPanel tone="warning" title="نیاز به تأیید شما" icon={PackageIcon} badge={items.length > 0 ? <Badge variant="warning">{items.length.toLocaleString("fa-IR")} مورد</Badge> : null} empty="موردی منتظر تأیید شما نیست." isEmpty={items.length === 0}>
      {items.map((item) => (
        <li key={item.id} className="flex flex-col gap-3 py-3">
          <div className="flex flex-col gap-1">
            <span className="text-label">{item.title}</span>
            <span className="text-body-sm text-muted-foreground">{item.detail}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => decide(item, true)}>تأیید</Button>
            <Button size="sm" variant="ghost" onClick={() => decide(item, false)}>رد</Button>
            <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/workflows/${item.flowId}`} />}>مشاهده‌ی جریان</Button>
          </div>
        </li>
      ))}
    </DeskPanel>
  );
}
