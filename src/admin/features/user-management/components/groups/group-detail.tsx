"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDirectory } from "../../hooks/use-directory";
import { BackLink } from "@/components/shared/back-link";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { StatusBadge } from "../status-badge";
import { GroupInfoTab } from "./group-info-tab";
import { GroupMembersTab } from "./group-members-tab";
import { GroupConnectionsTab } from "./group-connections-tab";
import { GroupDataTab } from "./group-data-tab";
import { GroupDocumentsTab } from "./group-documents-tab";
import { GroupModelsTab } from "./group-models-tab";

export function GroupDetail({ groupId }: { groupId: string }) {
  const { groups } = useDirectory();
  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink href="/admin/groups">بازگشت به گروه‌ها</BackLink>
        <EntityNotFound
          title="گروه پیدا نشد"
          backHref="/admin/groups"
          backLabel="بازگشت به گروه‌ها"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/groups">بازگشت به گروه‌ها</BackLink>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            {group.name}
            <bdi dir="ltr" className="text-body-sm font-normal text-muted-foreground">
              {group.code}
            </bdi>
            <StatusBadge status={group.status} />
          </span>
        }
        description={group.description || undefined}
      />
      <Tabs defaultValue="info">
        <TabsList className="h-auto max-w-full flex-wrap justify-start">
          <TabsTrigger value="info">اطلاعات</TabsTrigger>
          <TabsTrigger value="members">اعضا</TabsTrigger>
          <TabsTrigger value="models">مدل‌ها</TabsTrigger>
          <TabsTrigger value="documents">اسناد</TabsTrigger>
          <TabsTrigger value="data">داده</TabsTrigger>
          <TabsTrigger value="connections">اتصال‌ها</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="pt-4">
          <GroupInfoTab key={`${group.name}|${group.description}`} group={group} />
        </TabsContent>
        <TabsContent value="members" className="pt-4">
          <GroupMembersTab group={group} />
        </TabsContent>
        <TabsContent value="models" className="pt-4">
          <GroupModelsTab group={group} />
        </TabsContent>
        <TabsContent value="documents" className="pt-4">
          <GroupDocumentsTab group={group} />
        </TabsContent>
        <TabsContent value="data" className="pt-4">
          <GroupDataTab group={group} />
        </TabsContent>
        <TabsContent value="connections" className="pt-4">
          <GroupConnectionsTab group={group} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
