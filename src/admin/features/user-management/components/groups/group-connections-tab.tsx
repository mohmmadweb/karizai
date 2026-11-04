"use client";

import Link from "@/components/shared/app-link";
import { PlugIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { useConnections } from "@/admin/features/connections/components/connections-provider";
import { connectionTypeLabels } from "@/lib/connections";
import type { Group } from "../../types";
import { AccessToggleRow } from "./access-toggle-row";
import { inactiveReason } from "./use-group-grant";

/** Connections this group may use. The list of groups is kept on each connection. */
export function GroupConnectionsTab({ group }: { group: Group }) {
  const { connections, updateConnection } = useConnections();
  const locked = group.status === "inactive" ? inactiveReason : undefined;

  if (connections.length === 0) {
    return (
      <EmptyState
        icon={<PlugIcon />}
        title="هنوز اتصالی تعریف نشده"
        description="ابتدا در بخش «اتصال‌ها» یک اتصال بسازید."
        action={<Link href="/admin/connections" className={buttonVariants({ variant: "outline" })}>رفتن به اتصال‌ها</Link>}
      />
    );
  }

  function change(id: string, name: string, on: boolean) {
    const connection = connections.find((c) => c.id === id);
    if (!connection) return;
    const groupIds = on ? [...connection.groupIds.filter((g) => g !== group.id), group.id] : connection.groupIds.filter((g) => g !== group.id);
    const deactivate = !on && connection.active && groupIds.length === 0;
    updateConnection(id, deactivate ? { groupIds, active: false } : { groupIds });
    toast.success(
      deactivate
        ? `اتصال «${name}» چون گروهی ندارد غیرفعال شد.`
        : on ? `دسترسی گروه به «${name}» داده شد.` : `دسترسی گروه به «${name}» برداشته شد.`,
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-reading text-body-sm text-muted-foreground">
        هر کس در این گروه باشد اتصال‌های روشن را (اگر فعال باشند) در چت می‌بیند.
      </p>
      {locked ? <p className="text-body-sm text-muted-foreground">{locked}</p> : null}
      <ul className="flex flex-col divide-y rounded-xl border bg-card">
        {connections.map((c) => (
          <AccessToggleRow
            key={c.id}
            id={`gconn-${c.id}`}
            name={c.name}
            label={`دسترسی به اتصال ${c.name}`}
            hint={[connectionTypeLabels[c.type], c.domain].filter(Boolean).join(" · ")}
            badges={[c.active ? "فعال" : "غیرفعال"]}
            checked={c.groupIds.includes(group.id)}
            disabled={Boolean(locked)}
            onChange={(on) => change(c.id, c.name, on)}
          />
        ))}
      </ul>
    </div>
  );
}
