"use client";

import { useState } from "react";
import Link from "next/link";
import { PlugIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConnections } from "@/admin/features/connections/components/connections-provider";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { toolModeLabels, type Policies, type ToolMode } from "@/lib/policies";
import { hasWritingTool, modeOf, withMode } from "../lib/tool-access";
import { usePolicies } from "./policies-provider";

const items = (Object.keys(toolModeLabels) as ToolMode[]).map((value) => ({ value, label: toolModeLabels[value] }));

/** Read only or read and write, for each group and each connection. */
export function ToolAccessTab() {
  const { connections } = useConnections();
  const { groups } = useDirectory();
  const { policies, savePolicies, saving } = usePolicies();
  const [draft, setDraft] = useState<Policies["toolAccess"]>(policies.toolAccess);
  const active = groups.filter((g) => g.status === "active");
  const unchanged = JSON.stringify(draft) === JSON.stringify(policies.toolAccess);

  if (connections.length === 0) {
    return (
      <EmptyState
        icon={<PlugIcon />}
        title="هنوز اتصالی تعریف نشده"
        description="اتصال و ابزارهایش را در بخش «اتصال‌ها» بسازید، سپس نوع دسترسی هر گروه را اینجا تعیین کنید."
        action={<Link href="/admin/connections" className={buttonVariants({ variant: "outline" })}>رفتن به اتصال‌ها</Link>}
      />
    );
  }

  async function save() {
    if (await savePolicies({ ...policies, toolAccess: draft })) toast.success("دسترسی خواندن و نوشتن ذخیره شد.");
    else toast.error("ذخیره نشد؛ دوباره تلاش کنید.");
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-reading text-body-sm text-muted-foreground">
        گروهِ «فقط خواندن» ابزارهایی را که چیزی را تغییر می‌دهند (مثل ساخت Issue یا ارسال پیام) در چت نمی‌بیند. کاربری که عضو چند گروه است، بازترین حالت را می‌گیرد.
      </p>
      {connections.map((connection) => {
        const writable = hasWritingTool(connection);
        return (
          <section key={connection.id} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-h4 text-foreground">{connection.name}</h2>
              {writable ? null : <span className="text-caption text-muted-foreground">بدون ابزار تغییردهنده</span>}
            </div>
            <ul className="grid gap-3 md:grid-cols-2">
              {active.map((g) => (
                <li key={g.id} className="flex min-h-12 items-center justify-between gap-3 rounded-xl border bg-card px-4 py-2">
                  <span id={`tm-${connection.id}-${g.id}`} className="text-label text-foreground">{g.name}</span>
                  <Select
                    items={items}
                    value={modeOf(draft, g.id, connection.id)}
                    disabled={!writable || saving}
                    onValueChange={(value) => value && setDraft((d) => withMode(d, g.id, connection.id, value as ToolMode))}
                  >
                    <SelectTrigger className="w-40" aria-labelledby={`tm-${connection.id}-${g.id}`}><SelectValue /></SelectTrigger>
                    <SelectContent><SelectGroup>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
                  </Select>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <div><Button className="min-h-10" loading={saving} disabled={unchanged} onClick={save}>ذخیره</Button></div>
    </div>
  );
}
