"use client";

import Link from "next/link";
import { UsersIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useDirectory } from "../../hooks/use-directory";
import { membersOfGroup } from "../../lib/selectors";
import type { Group } from "../../types";
import { MembershipPicker } from "../membership-picker";
import { StatusBadge } from "../status-badge";

/** Add and remove members of one group; shared by the group page tab and the groups side panel. */
export function GroupMembersManager({ group, idPrefix }: { group: Group; idPrefix: string }) {
  const { users, memberships, addMember, removeMember } = useDirectory();
  const members = membersOfGroup(group.id, users, memberships);
  const memberIds = new Set(members.map((u) => u.id));
  const options = users
    .filter((u) => u.status === "active" && !memberIds.has(u.id))
    .map((u) => ({ value: u.id, label: u.name, hint: u.email }));

  return (
    <div className="flex flex-col gap-6">
      <MembershipPicker
        id={`${idPrefix}-add-member`}
        label="افزودن عضو"
        placeholder="یک یا چند کاربر انتخاب کنید"
        addLabel="افزودن عضو"
        options={options}
        searchable
        multiple
        disabledReason={
          group.status === "inactive"
            ? "به گروه غیرفعال عضو اضافه نمی‌شود."
            : options.length === 0
              ? "کاربر دیگری برای افزودن نیست."
              : undefined
        }
        onAdd={() => {}}
        onAddMany={(userIds) => {
          const failed = userIds
            .map((userId) => addMember(userId, group.id))
            .filter((result) => !result.ok);
          const added = userIds.length - failed.length;
          if (added > 0)
            toast.success(added === 1 ? "عضو به گروه اضافه شد." : "اعضا به گروه اضافه شدند.");
          const firstError = failed.find((result) => !result.ok);
          if (firstError && !firstError.ok) toast.error(firstError.error);
        }}
      />
      {members.length === 0 ? (
        <EmptyState
          icon={<UsersIcon />}
          title="این گروه هنوز عضوی ندارد"
          description="از بالا یک کاربر انتخاب کنید و «افزودن عضو» را بزنید."
        />
      ) : (
        <ul
          role="region"
          aria-label={`اعضای گروه ${group.name}`}
          tabIndex={0}
          className="flex max-h-96 flex-col divide-y divide-border overflow-y-auto rounded-xl border border-border outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {members.map((user) => (
            <li key={user.id} className="flex items-center justify-between gap-3 p-3">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="rounded-sm font-medium outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {user.name}
                  </Link>
                  <StatusBadge status={user.status} />
                </span>
                <span className="truncate text-body-sm text-muted-foreground">
                  <bdi dir="ltr">{user.email}</bdi>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  removeMember(user.id, group.id);
                  toast.success("عضو از گروه برداشته شد.");
                }}
              >
                <XIcon aria-hidden />
                برداشتن
                <span className="sr-only"> {user.name} از گروه</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
