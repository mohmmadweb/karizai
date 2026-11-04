"use client";

import { toast } from "sonner";
import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import type { AccessResourceType } from "@/admin/features/access-control/types";
import type { Group } from "../../types";

/** Reads and changes the grants a group has on one kind of resource. */
export function useGroupGrant(group: Group, resourceType: AccessResourceType) {
  const { grants, grant, revoke } = useAccess();
  const key = (resourceId: string) => ({ resourceType, resourceId, subjectType: "group" as const, subjectId: group.id });
  return {
    has: (resourceId: string) =>
      grants.some((g) => g.resourceType === resourceType && g.resourceId === resourceId && g.subjectType === "group" && g.subjectId === group.id),
    set: (resourceId: string, on: boolean, name: string) => {
      if (on) grant(key(resourceId));
      else revoke(key(resourceId));
      toast.success(on ? `دسترسی گروه به «${name}» داده شد.` : `دسترسی گروه به «${name}» برداشته شد.`);
    },
  };
}

export const inactiveReason = "برای گروه غیرفعال دسترسی تازه داده نمی‌شود.";
