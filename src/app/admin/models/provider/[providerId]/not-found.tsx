import { EntityNotFound } from "@/components/shared/entity-not-found";

export default function ProviderNotFound() {
  return <EntityNotFound title="ارائه‌دهنده پیدا نشد" backHref="/admin/models" backLabel="بازگشت به ارائه‌دهنده‌ها" />;
}
