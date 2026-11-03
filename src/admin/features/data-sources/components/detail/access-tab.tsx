"use client";

import { toast } from "sonner";
import { AccessGrantsPanel } from "@/admin/components/shared/access-grants-panel";
import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { groupAccessSide, userAccessSide } from "@/admin/features/access-control/lib/access-sides";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import type { DataSource } from "../../types";

/** Who may use the data assistant on the whole database; parts of it are given from the schemas tab. */
export function AccessTab({ source }: { source: DataSource }) {
  const { users, groups, memberships } = useDirectory();
  const { grants, grant, revoke } = useAccess();
  const input = { resourceType: "database" as const, resourceId: source.id, grants, users, groups, memberships };
  const key = (type: "group" | "user", id: string) => ({
    resourceType: "database" as const,
    resourceId: source.id,
    subjectType: type,
    subjectId: id,
  });

  return (
    <div className="flex flex-col gap-6">
      <p className="text-body-sm text-muted-foreground">
        هر کس اینجا اضافه شود به کل انبار داده دسترسی دارد. برای دسترسی به بخشی از جدول‌ها از تب «اسکیماها» استفاده کنید.
      </p>
      <AccessGrantsPanel
        idPrefix="source-access"
        groups={groupAccessSide(input)}
        users={userAccessSide(input)}
        emptyMessage="هنوز هیچ‌کس به کل این انبار داده دسترسی ندارد."
        onGrant={(type, id) => {
          grant(key(type, id));
          toast.success(type === "group" ? "دسترسی گروه اضافه شد." : "دسترسی کاربر اضافه شد.");
        }}
        onRevoke={(type, id) => {
          revoke(key(type, id));
          toast.success("دسترسی برداشته شد.");
        }}
      />
    </div>
  );
}
