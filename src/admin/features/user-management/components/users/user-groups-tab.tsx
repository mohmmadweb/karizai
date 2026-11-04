"use client";

import Link from "@/components/shared/app-link";
import { UsersRoundIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useDirectory } from "../../hooks/use-directory";
import { groupsOfUser } from "../../lib/selectors";
import type { User } from "../../types";
import { MembershipPicker } from "../membership-picker";
import { StatusBadge } from "../status-badge";

export function UserGroupsTab({ user }: { user: User }) {
  const { groups, memberships, addMember, removeMember } = useDirectory();
  const own = groupsOfUser(user.id, groups, memberships);
  const ownIds = new Set(own.map((g) => g.id));
  const options = groups
    .filter((g) => g.status === "active" && !ownIds.has(g.id))
    .map((g) => ({ value: g.id, label: g.name }));

  return (
    <div className="flex flex-col gap-6">
      <MembershipPicker
        id="user-add-group"
        label="افزودن به گروه"
        placeholder="یک گروه انتخاب کنید"
        addLabel="افزودن گروه"
        options={options}
        disabledReason={
          user.status === "inactive"
            ? "کاربر غیرفعال را نمی‌شود به گروه اضافه کرد."
            : undefined
        }
        onAdd={(groupId) => {
          const result = addMember(user.id, groupId);
          if (result.ok) toast.success("کاربر به گروه اضافه شد.");
          else toast.error(result.error);
        }}
      />
      {own.length === 0 ? (
        <EmptyState
          icon={<UsersRoundIcon />}
          title="این کاربر عضو هیچ گروهی نیست"
          description="از بالا یک گروه انتخاب کنید و «افزودن گروه» را بزنید."
        />
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
          {own.map((group) => (
            <li key={group.id} className="flex items-center justify-between gap-3 p-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Link
                  href={`/admin/groups/${group.id}`}
                  className="rounded-sm font-medium outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {group.name}
                </Link>
                <StatusBadge status={group.status} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  removeMember(user.id, group.id);
                  toast.success("عضویت از این گروه برداشته شد.");
                }}
              >
                <XIcon aria-hidden />
                برداشتن
                <span className="sr-only"> از گروه {group.name}</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
