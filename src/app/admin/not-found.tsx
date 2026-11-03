import { EntityNotFound } from "@/components/shared/entity-not-found";

export default function AdminNotFound() {
  return <EntityNotFound title="صفحه پیدا نشد" backHref="/admin/dashboard" backLabel="بازگشت به داشبورد" />;
}
