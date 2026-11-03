"use client";

import Link from "next/link";
import { ShieldAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/admin/features/documents/hooks/use-documents";
import { useModels } from "@/admin/features/models/hooks/use-models";

/** The rule in words, the confidential documents and the internal models that may use them. */
export function ConfidentialityTab() {
  const { documents } = useDocuments();
  const { models, providers } = useModels();
  const confidential = documents.filter((d) => d.confidential);
  const internal = models.filter((m) => m.selfHosted && m.enabled);
  const providerName = (id: string) => providers.find((p) => p.id === id)?.name;

  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-reading text-body text-foreground">
        سند محرمانه فقط با مدل‌های داخلی (سلف‌هاست) کار می‌کند و هرگز به مدل خارجی داده نمی‌شود. نشان «محرمانه» را روی خود سند، در بخش اسناد، می‌زنید.
      </p>
      {confidential.length > 0 && internal.length === 0 ? (
        <Alert variant="warning">
          <ShieldAlertIcon aria-hidden />
          <AlertTitle>سند محرمانه با هیچ مدلی قابل استفاده نیست</AlertTitle>
          <AlertDescription>هیچ مدل داخلی فعالی نیست؛ یک مدل سلف‌هاست را در بخش «مدل‌ها» فعال کنید.</AlertDescription>
        </Alert>
      ) : null}
      <section className="flex flex-col gap-3">
        <h2 className="text-h4 text-foreground">اسناد محرمانه</h2>
        {confidential.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">
            هنوز سندی محرمانه نشده. در صفحه‌ی هر سند، تب «اطلاعات»، گزینه‌ی «محرمانه» را بزنید.
          </p>
        ) : (
          <ul className="flex flex-col divide-y rounded-xl border bg-card">
            {confidential.map((doc) => (
              <li key={doc.id} className="flex min-h-12 flex-wrap items-center justify-between gap-2 px-4 py-2">
                <Link href={`/admin/documents/${doc.id}`} className="rounded-sm text-label text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">{doc.name}</Link>
                <Badge variant="secondary">محرمانه</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-h4 text-foreground">مدل‌های داخلی فعال</h2>
        {internal.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">مدل داخلی فعالی نیست.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {internal.map((m) => (
              <li key={m.id}><Badge variant="outline"><bdi dir="ltr">{m.displayName}</bdi>{providerName(m.providerId) ? ` · ${providerName(m.providerId)}` : ""}</Badge></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
