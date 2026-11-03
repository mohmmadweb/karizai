"use client";

import { CheckCircle2Icon, CircleAlertIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDataSources } from "../../hooks/use-data-sources";
import type { DataSource } from "../../types";
import { ActivationControls } from "./activation-controls";

/** Test the saved details, see the result, then activate. */
export function TestConnectionSection({ source }: { source: DataSource }) {
  const { testSource, testing } = useDataSources();
  const busy = Boolean(testing[source.id]);

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-h4 text-foreground">آزمایش و فعال‌سازی</h2>
        <p className="text-body-sm text-muted-foreground">
          اول اتصال را آزمایش کنید. فقط اتصالِ آزموده‌شده‌ی موفق را می‌شود فعال کرد.
        </p>
      </div>
      <div>
        <Button variant="outline" loading={busy} onClick={() => void testSource(source.id)}>
          آزمایش اتصال
        </Button>
      </div>
      {source.testResult === "success" ? (
        <Alert variant="success" role="status">
          <CheckCircle2Icon aria-hidden />
          <AlertTitle>اتصال برقرار شد</AlertTitle>
        </Alert>
      ) : null}
      {source.testResult === "failed" ? (
        <Alert variant="destructive" role="status">
          <CircleAlertIcon aria-hidden />
          <AlertTitle>اتصال برقرار نشد</AlertTitle>
          <AlertDescription>نشانی سرور، درگاه و حساب کاربری را بررسی کنید و دوباره آزمایش کنید.</AlertDescription>
        </Alert>
      ) : null}
      {source.testResult === "untested" ? (
        <Alert variant="info" role="status">
          <InfoIcon aria-hidden />
          <AlertTitle>هنوز آزمایش نشده است</AlertTitle>
        </Alert>
      ) : null}
      <ActivationControls source={source} />
    </section>
  );
}
