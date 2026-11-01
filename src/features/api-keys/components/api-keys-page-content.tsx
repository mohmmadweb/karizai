"use client";

import { useState } from "react";
import { KeyRoundIcon, PlusIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useApiKeys } from "./api-keys-provider";
import { CreateKeyDialog } from "./create-key-dialog";
import { KeysList } from "./keys-list";
import { SecretDialog } from "./secret-dialog";
import { UsageGuide } from "./usage-guide";

export function ApiKeysPageContent() {
  const { keys, allowed } = useApiKeys();
  const [creating, setCreating] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const canCreate = allowed.kinds.length > 0;
  const createButton = canCreate ? <Button onClick={() => setCreating(true)}><PlusIcon aria-hidden />کلید تازه</Button> : undefined;

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="API من" description="با کلید API، نرم‌افزارهای دیگر می‌توانند از مدل یا عاملی که به آن دسترسی دارید استفاده کنند. کلید را خودتان می‌سازید و هر زمان بخواهید ابطالش می‌کنید." action={keys.length > 0 ? createButton : undefined} />
      {!canCreate && keys.length === 0 ? (
        <EmptyState icon={<KeyRoundIcon />} title="اجازه‌ی ساخت کلید ندارید" description="گروه‌های شما هنوز اجازه‌ی ساخت کلید API ندارند. برای دسترسی با ادمین تماس بگیرید." />
      ) : keys.length === 0 ? (
        <EmptyState icon={<KeyRoundIcon />} title="هنوز کلیدی نساخته‌اید" description="اولین کلید را برای یک مدل یا عامل بسازید و در برنامه‌ی خود به کار ببرید." action={createButton} />
      ) : (
        <KeysList keys={[...keys].sort((a, b) => b.createdAt.localeCompare(a.createdAt))} />
      )}
      {canCreate ? <UsageGuide kinds={allowed.kinds} /> : null}
      <CreateKeyDialog open={creating} onOpenChange={setCreating} onCreated={setSecret} />
      <SecretDialog secret={secret} onClose={() => setSecret(null)} />
    </div>
  );
}
