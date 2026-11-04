"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { flatten, getOrgTree, type OrgUnit } from "../data/org";
import { AdTab } from "./ad-tab";
import { OrgTree } from "./org-tree";
import { RolesTab } from "./roles-tab";

const remap = (u: OrgUnit, id: string, groupId: string | null): OrgUnit => ({
  ...u,
  groupId: u.id === id ? groupId : u.groupId,
  children: u.children?.map((c) => remap(c, id, groupId)),
});

/** Units as a tree, the admin roles with their scope, and Active Directory sync. */
export function OrganizationPageContent() {
  const [tree, setTree] = useState(getOrgTree);
  const units = flatten(tree);
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="ساختار و نقش‌ها" description={<>واحدهای سازمان و گروه کاریزِ هر کدام، نقش‌های مدیریتی با دامنه‌ی هر نقش، و همگام‌سازی با <bdi dir="ltr" className="whitespace-nowrap">Active Directory</bdi>.</>} />
      <Tabs defaultValue="tree">
        <TabsList>
          <TabsTrigger value="tree">درخت سازمان</TabsTrigger>
          <TabsTrigger value="roles">نقش‌های مدیریتی</TabsTrigger>
          <TabsTrigger value="ad">Active Directory</TabsTrigger>
        </TabsList>
        <TabsContent value="tree" className="pt-4">
          <OrgTree root={tree} onMap={(id, groupId) => { setTree((t) => remap(t, id, groupId)); toast.success("نگاشت گروه ذخیره شد."); }} />
        </TabsContent>
        <TabsContent value="roles" className="pt-4"><RolesTab units={units} /></TabsContent>
        <TabsContent value="ad" className="pt-4"><AdTab units={units} /></TabsContent>
      </Tabs>
    </div>
  );
}
