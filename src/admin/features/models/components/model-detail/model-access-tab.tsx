"use client";

import { toast } from "sonner";
import { AccessGrantsPanel } from "@/admin/components/shared/access-grants-panel";
import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { groupAccessSide, userAccessSide } from "@/admin/features/access-control/lib/access-sides";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import type { AiModel } from "../../types";

/** Who may use this model: groups, plus users with special access. */
export function ModelAccessTab({ model }: { model: AiModel }) {
  const { users, groups, memberships } = useDirectory();
  const { grants, grant, revoke } = useAccess();
  const input = { resourceType: "model" as const, resourceId: model.id, grants, users, groups, memberships };
  const key = (type: "group" | "user", id: string) => ({
    resourceType: "model" as const,
    resourceId: model.id,
    subjectType: type,
    subjectId: id,
  });

  return (
    <AccessGrantsPanel
      idPrefix="model-access"
      groups={groupAccessSide(input)}
      users={userAccessSide(input)}
      emptyMessage="هنوز هیچ‌کس به این مدل دسترسی ندارد."
      onGrant={(type, id) => {
        grant(key(type, id));
        toast.success(type === "group" ? "دسترسی گروه اضافه شد." : "دسترسی کاربر اضافه شد.");
      }}
      onRevoke={(type, id) => {
        revoke(key(type, id));
        toast.success("دسترسی برداشته شد.");
      }}
    />
  );
}
