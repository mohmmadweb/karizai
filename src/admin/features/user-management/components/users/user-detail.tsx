"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDirectory } from "../../hooks/use-directory";
import { BackLink } from "@/components/shared/back-link";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { StatusBadge } from "../status-badge";
import { UserGroupsTab } from "./user-groups-tab";
import { UserInfoTab } from "./user-info-tab";

export function UserDetail({ userId }: { userId: string }) {
  const { users } = useDirectory();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink href="/admin/users">بازگشت به کاربران</BackLink>
        <EntityNotFound
          title="کاربر پیدا نشد"
          backHref="/admin/users"
          backLabel="بازگشت به کاربران"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/users">بازگشت به کاربران</BackLink>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            {user.name}
            <StatusBadge status={user.status} />
          </span>
        }
        description={<bdi dir="ltr">{user.email}</bdi>}
      />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">اطلاعات</TabsTrigger>
          <TabsTrigger value="groups">گروه‌ها</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="pt-4">
          <UserInfoTab key={`${user.name}|${user.email}`} user={user} />
        </TabsContent>
        <TabsContent value="groups" className="pt-4">
          <UserGroupsTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
