import { EntityNotFound } from "@/components/shared/entity-not-found";

export default function SourceNotFound() {
  return <EntityNotFound title="منبع پیدا نشد" backHref="/admin/documents" backLabel="بازگشت به اسناد" />;
}
