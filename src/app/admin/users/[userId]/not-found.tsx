import { EntityNotFound } from "@/components/shared/entity-not-found";

export default function UserNotFound() {
  return (
    <EntityNotFound
      title="کاربر پیدا نشد"
      backHref="/admin/users"
      backLabel="بازگشت به کاربران"
    />
  );
}
