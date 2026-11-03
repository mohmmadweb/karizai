"use client";

import { BanIcon, KeyRoundIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { apiKeyKindLabels, apiKeyStatus, apiKeyStatusLabels, type ApiKeyRecord, type ApiKeyStatus } from "@/lib/api-keys";
import { formatDate } from "@/admin/lib/format";
import { useApiKeys } from "./api-keys-provider";

const statusBadge: Record<ApiKeyStatus, "success" | "secondary" | "warning"> = { active: "success", expired: "warning", revoked: "secondary" };

/** Every key of every user, for supervision. The admin can revoke any key but never sees its text. */
export function KeysSection() {
  const { keys, revokeKey } = useApiKeys();
  const sorted = [...keys].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (keys.length === 0) {
    return <EmptyState icon={<KeyRoundIcon />} title="هنوز کلیدی ساخته نشده است" description="وقتی کاربرانِ گروه‌های مجاز کلید بسازند، اینجا برای نظارت و ابطال دیده می‌شوند." />;
  }

  const columns: DataTableColumn<ApiKeyRecord>[] = [
    { id: "name", header: "کلید", cell: (k) => <span className="flex flex-col items-start"><span className="font-medium">{k.name}</span><bdi dir="ltr" className="font-mono text-body-sm text-muted-foreground">msk_…{k.last4}</bdi></span> },
    { id: "owner", header: "صاحب", cell: (k) => k.ownerName },
    { id: "resource", header: "دسترسی", hideBelow: "lg", cell: (k) => <span>{apiKeyKindLabels[k.kind]}: {k.resourceName}</span> },
    { id: "lastUsed", header: "آخرین استفاده", hideBelow: "xl", className: "text-muted-foreground", cell: (k) => (k.lastUsedAt ? formatDate(k.lastUsedAt) : "هنوز استفاده نشده") },
    { id: "status", header: "وضعیت", cell: (k) => { const s = apiKeyStatus(k); return <Badge variant={statusBadge[s]}>{apiKeyStatusLabels[s]}</Badge>; } },
  ];

  return (
    <DataTable
      label="فهرست کلیدهای API"
      rows={sorted}
      columns={columns}
      getRowId={(k) => k.id}
      getRowLabel={(k) => `کلید ${k.name}`}
      getRowActions={(k) =>
        k.revokedAt
          ? []
          : [[{
              label: "ابطال",
              icon: <BanIcon aria-hidden />,
              destructive: true,
              confirm: { title: "کلید ابطال شود؟", description: `برنامه‌هایی که از کلید «${k.name}» استفاده می‌کنند دیگر پاسخی نمی‌گیرند. این کار برگشت‌پذیر نیست.`, confirmLabel: "ابطال کلید" },
              onSelect: () => void revokeKey(k.id).then((ok) => (ok ? toast.success("کلید ابطال شد.") : toast.error("ابطال انجام نشد."))),
            }]]
      }
      defaultPageSize={10}
      renderCard={(k, actions) => (
        <>
          <div className="flex items-start justify-between gap-3"><span className="font-medium">{k.name}</span>{actions}</div>
          <p className="text-body-sm text-muted-foreground">{k.ownerName} · {apiKeyKindLabels[k.kind]}: {k.resourceName} · {apiKeyStatusLabels[apiKeyStatus(k)]}</p>
        </>
      )}
    />
  );
}
