"use client";

import Link from "next/link";
import { EyeIcon, PowerIcon, PowerOffIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type {
  DataTableActionGroup,
  DataTableColumn,
} from "@/admin/components/shared/data-table/types";
import { Badge } from "@/components/ui/badge";
import { useDirectory } from "../../hooks/use-directory";
import { groupsOfUser } from "../../lib/selectors";
import type { Group, Membership, User } from "../../types";
import { StatusBadge } from "../status-badge";

type UsersListProps = {
  users: User[];
  groups: Group[];
  memberships: Membership[];
};

function GroupNames({ groups }: { groups: Group[] }) {
  if (groups.length === 0)
    return <span className="text-body-sm text-muted-foreground">بدون گروه</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {groups.map((g) => (
        <Badge key={g.id} variant="outline">
          {g.name}
        </Badge>
      ))}
    </span>
  );
}

const linkClass =
  "rounded-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

export function UsersList({ users, groups, memberships }: UsersListProps) {
  const { setUserStatus } = useDirectory();
  const groupsOf = (user: User) => groupsOfUser(user.id, groups, memberships);

  const columns: DataTableColumn<User>[] = [
    {
      id: "name",
      header: "نام",
      cell: (user) => (
        <Link href={`/admin/users/${user.id}`} className={linkClass}>
          {user.name}
        </Link>
      ),
    },
    {
      id: "email",
      header: "ایمیل",
      className: "text-muted-foreground",
      cell: (user) => <bdi dir="ltr">{user.email}</bdi>,
    },
    {
      id: "groups",
      header: "گروه‌ها",
      hideBelow: "lg",
      cell: (user) => <GroupNames groups={groupsOf(user)} />,
    },
    { id: "status", header: "وضعیت", cell: (user) => <StatusBadge status={user.status} /> },
  ];

  function actionsOf(user: User): DataTableActionGroup[] {
    const active = user.status === "active";
    const change = (next: boolean) => {
      const result = setUserStatus(user.id, next);
      if (!result.ok) toast.error(result.error);
      else toast.success(next ? "کاربر فعال شد." : "کاربر غیرفعال شد.");
    };
    return [
      [
        {
          label: "مشاهده جزئیات",
          icon: <EyeIcon aria-hidden />,
          inline: true,
          href: `/admin/users/${user.id}`,
        },
      ],
      [
        active
          ? {
              label: "غیرفعال‌کردن",
              icon: <PowerOffIcon aria-hidden />,
              destructive: true,
              disabled: user.role === "admin",
              onSelect: () => change(false),
              confirm: {
                title: `کاربر «${user.name}» غیرفعال شود؟`,
                description:
                  "این کاربر دیگر نمی‌تواند وارد شود، ولی گزارش مصرف و چت‌هایش برای ادمین می‌ماند.",
                confirmLabel: "غیرفعال‌کردن",
              },
            }
          : {
              label: "فعال‌کردن",
              icon: <PowerIcon aria-hidden />,
              onSelect: () => change(true),
            },
      ],
    ];
  }

  return (
    <DataTable
      label="فهرست کاربران"
      rows={users}
      columns={columns}
      getRowId={(user) => user.id}
      getRowLabel={(user) => `کاربر ${user.name}`}
      getRowActions={actionsOf}
      defaultPageSize={5}
      renderCard={(user, actions) => (
        <>
          <div className="flex items-start justify-between gap-3">
            <Link href={`/admin/users/${user.id}`} className={linkClass}>
              {user.name}
            </Link>
            <div className="flex items-center gap-1">
              <StatusBadge status={user.status} />
              {actions}
            </div>
          </div>
          <p className="truncate text-body-sm text-muted-foreground">
            <bdi dir="ltr">{user.email}</bdi>
          </p>
          <GroupNames groups={groupsOf(user)} />
        </>
      )}
    />
  );
}
