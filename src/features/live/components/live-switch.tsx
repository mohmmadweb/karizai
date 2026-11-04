"use client";

import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useDemoFlags } from "@/lib/demo-flags";
import { cn } from "@/lib/utils";

/** «حالت زنده»: active workflows start by themselves on a demo clock. Off by default. */
export function LiveSwitch({ className }: { className?: string }) {
  const { live, setLive } = useDemoFlags();
  function change(next: boolean) {
    setLive(next);
    if (next) toast.success("حالت زنده روشن شد", { description: "جریان‌های فعال هر حدود یک دقیقه خودشان اجرا می‌شوند." });
    else toast.info("حالت زنده خاموش شد");
  }
  return (
    <label className={cn("flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg border bg-card px-3 text-label", className)} title="جریان‌های زمان‌بندی‌شده و رویدادی خودشان اجرا شوند">
      <span aria-hidden className="relative flex size-2.5">
        {live ? <span className="absolute inline-flex size-full rounded-full bg-success opacity-70 motion-safe:animate-ping" /> : null}
        <span className={cn("relative inline-flex size-2.5 rounded-full", live ? "bg-success" : "bg-muted-foreground/40")} />
      </span>
      حالت زنده
      <Switch checked={live} onCheckedChange={change} aria-label="حالت زنده" />
    </label>
  );
}
