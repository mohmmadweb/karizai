import { EntityNotFound } from "@/components/shared/entity-not-found";

export default function SourceNotFound() {
  return (
    <EntityNotFound
      title="اتصال پیدا نشد"
      backHref="/admin/data"
      backLabel="بازگشت به داده"
    />
  );
}
