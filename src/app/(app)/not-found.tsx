import { EntityNotFound } from "@/components/shared/entity-not-found";

export default function AppNotFound() {
  return <EntityNotFound title="صفحه پیدا نشد" backHref="/chat" backLabel="بازگشت به گفتگو" />;
}
