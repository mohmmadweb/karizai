"use client";

import { PlusIcon, ServerIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useDocuments } from "../../hooks/use-documents";
import { SourcesList } from "./sources-list";

export function SourcesTab({ onAdd }: { onAdd: () => void }) {
  const { sources } = useDocuments();
  if (sources.length === 0) {
    return (
      <EmptyState
        icon={<ServerIcon />}
        title="هنوز منبعی ثبت نشده است"
        description="پوشه‌ی فایل‌سرور را معرفی کنید تا اسنادش همگام شود."
        action={<Button onClick={onAdd}><PlusIcon aria-hidden />افزودن منبع</Button>}
      />
    );
  }
  return <SourcesList sources={sources} />;
}
