import { EntityNotFound } from "@/components/shared/entity-not-found";

export default function GroupNotFound() {
  return (
    <EntityNotFound
      title="گروه پیدا نشد"
      backHref="/admin/groups"
      backLabel="بازگشت به گروه‌ها"
    />
  );
}
