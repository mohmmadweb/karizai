import { EntityNotFound } from "@/components/shared/entity-not-found";

export default function ModelNotFound() {
  return (
    <EntityNotFound
      title="مدل پیدا نشد"
      backHref="/admin/models"
      backLabel="بازگشت به مدل‌ها"
    />
  );
}
