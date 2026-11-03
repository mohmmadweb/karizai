import { GroupDetail } from "@/admin/features/user-management/components/groups/group-detail";
import { getGroups } from "@/admin/features/user-management/data/groups";
import { toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams("groupId", [...getGroups().map((item) => item.id), ...Array.from({ length: 30 }, (_, i) => `group-${String(i + 1).padStart(3, "0")}`)]);
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  return <GroupDetail groupId={groupId} />;
}
