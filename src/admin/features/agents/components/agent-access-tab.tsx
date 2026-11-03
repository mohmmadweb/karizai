"use client";

import { toast } from "sonner";
import { AccessGrantsPanel } from "@/admin/components/shared/access-grants-panel";
import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { groupAccessSide, userAccessSide } from "@/admin/features/access-control/lib/access-sides";
import { accessPermissionLabels } from "@/admin/features/access-control/types";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";

/** Who may use this Agent, and whether only to read or also to let it write for them. */
export function AgentAccessTab({ agentId }: { agentId: string }) {
  const { users, groups, memberships } = useDirectory();
  const { grants, grant, revoke, setPermission } = useAccess();
  const input = { resourceType: "agent" as const, resourceId: agentId, grants, users, groups, memberships };
  const key = (type: "group" | "user", id: string) => ({ resourceType: "agent" as const, resourceId: agentId, subjectType: type, subjectId: id });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-body-sm text-muted-foreground">
        «خواندن»: عامل برای این افراد فقط می‌خواند و پاسخ می‌دهد. «خواندن‌ونوشتن»: ابزارهای نوشتنی مجاز عامل هم برایشان کار می‌کند.
      </p>
      <AccessGrantsPanel
        idPrefix="agent-access"
        groups={groupAccessSide(input)}
        users={userAccessSide(input)}
        emptyMessage="هنوز هیچ‌کس به این عامل دسترسی ندارد."
        onGrant={(type, id) => {
          grant({ ...key(type, id), permission: "read" });
          toast.success("دسترسی خواندن اضافه شد.");
        }}
        onRevoke={(type, id) => {
          revoke(key(type, id));
          toast.success("دسترسی برداشته شد.");
        }}
        onPermissionChange={(type, id, permission) => {
          setPermission(key(type, id), permission);
          toast.success(`مجوز به «${accessPermissionLabels[permission]}» تغییر کرد.`);
        }}
      />
    </div>
  );
}
