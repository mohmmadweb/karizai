"use client";

import { useState } from "react";
import { PlusIcon, ServerIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useModels } from "../hooks/use-models";
import type { ModelProvider } from "../types";
import { RoutersSection } from "@/admin/features/smart-router/components/routers-section";
import { ProviderDialog } from "./providers/provider-dialog";
import { ProvidersList } from "./providers/providers-list";
import { NewVersionsNotice } from "./new-versions-notice";

/** First screen of «مدل‌ها»: the providers. Each one opens its own models table. */
export function ModelsPageContent() {
  const { providers } = useModels();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [editing, setEditing] = useState<ModelProvider | null>(null);

  const registerButton = (
    <Button onClick={() => setRegisterOpen(true)}>
      <PlusIcon aria-hidden />
      ثبت ارائه‌دهنده
    </Button>
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="مدل‌ها"
        description="ارائه‌دهنده‌های هوش مصنوعی سازمان. برای دیدن مدل‌های هر ارائه‌دهنده، آن را باز کنید."
        action={registerButton}
      />
      <NewVersionsNotice />
      <RoutersSection />
      <h2 className="text-h3">ارائه‌دهنده‌ها</h2>
      {providers.length === 0 ? (
        <EmptyState
          icon={<ServerIcon />}
          title="هنوز ارائه‌دهنده‌ای ثبت نشده است"
          description="با ثبت اولین ارائه‌دهنده شروع کنید تا فهرست مدل‌هایش گرفته شود."
          action={registerButton}
        />
      ) : (
        <ProvidersList onEdit={setEditing} />
      )}
      <ProviderDialog open={registerOpen} onOpenChange={setRegisterOpen} />
      <ProviderDialog
        open={editing !== null}
        provider={editing ?? undefined}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      />
    </div>
  );
}
