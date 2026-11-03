"use client";

import { useState } from "react";
import {
  AccessGrantsPanel,
  type AccessSubject,
} from "@/admin/components/shared/access-grants-panel";

const everyGroup: AccessSubject[] = [
  { id: "g1", label: "گروه نمونه‌ی اول" },
  { id: "g2", label: "گروه نمونه‌ی دوم" },
  { id: "g3", label: "گروه نمونه‌ی سوم", inactive: true },
];
const everyUser: AccessSubject[] = [
  { id: "u1", label: "کاربر نمونه‌ی اول", hint: "first@example.com" },
  { id: "u2", label: "کاربر نمونه‌ی دوم", hint: "second@example.com" },
];

/** Neutral preview of the shared access panel with temporary local state. */
export function AccessGrantsDemo() {
  const [groupIds, setGroupIds] = useState<string[]>(["g1"]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const split = (all: AccessSubject[], ids: string[]) => ({
    granted: all.filter((s) => ids.includes(s.id)),
    available: all.filter((s) => !ids.includes(s.id) && !s.inactive),
  });
  return (
    <AccessGrantsPanel
      idPrefix="demo-access"
      groups={split(everyGroup, groupIds)}
      users={split(everyUser, userIds)}
      emptyMessage="هنوز هیچ‌کس به این مورد دسترسی ندارد."
      onGrant={(type, id) =>
        (type === "group" ? setGroupIds : setUserIds)((ids) => [...ids, id])
      }
      onRevoke={(type, id) =>
        (type === "group" ? setGroupIds : setUserIds)((ids) =>
          ids.filter((x) => x !== id),
        )
      }
    />
  );
}
