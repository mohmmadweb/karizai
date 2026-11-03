"use client";

import { toast } from "sonner";
import { AccessGrantsPanel } from "@/admin/components/shared/access-grants-panel";
import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { groupAccessSide, userAccessSide } from "@/admin/features/access-control/lib/access-sides";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import type { FileSource } from "../../types";

/** Who may see every document of this folder, now and after later syncs. */
export function SourceAccessTab({ source }: { source: FileSource }) {
  const { users, groups, memberships } = useDirectory();
  const { grants, grant, revoke } = useAccess();
  const input = { resourceType: "folder" as const, resourceId: source.id, grants, users, groups, memberships };
  const key = (type: "group" | "user", id: string) => ({
    resourceType: "folder" as const,
    resourceId: source.id,
    subjectType: type,
    subjectId: id,
  });
  return (
    <div className="flex flex-col gap-6">
      <p className="text-body-sm text-muted-foreground">
        هر کس اینجا اضافه شود به همه‌ی اسناد این پوشه، چه حالا و چه در همگام‌سازی‌های بعدی، دسترسی دارد. هر سند دسترسی خودش را هم دارد.
      </p>
      <AccessGrantsPanel
        idPrefix="folder-access"
        groups={groupAccessSide(input)}
        users={userAccessSide(input)}
        emptyMessage="برای این پوشه هیچ‌کس تعیین نشده؛ اسنادش فقط با دسترسی خودشان دیده می‌شوند."
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
