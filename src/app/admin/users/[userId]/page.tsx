import { UserDetail } from "@/admin/features/user-management/components/users/user-detail";
import { getUsers } from "@/admin/features/user-management/data/users";
import { toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams("userId", [...getUsers().map((item) => item.id), ...Array.from({ length: 60 }, (_, i) => `user-${String(i + 1).padStart(3, "0")}`)]);
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <UserDetail userId={userId} />;
}
