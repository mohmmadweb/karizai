import { EntityNotFound } from "@/components/shared/entity-not-found";

export default function DocumentNotFound() {
  return <EntityNotFound title="سند پیدا نشد" backHref="/admin/documents" backLabel="بازگشت به اسناد" />;
}
