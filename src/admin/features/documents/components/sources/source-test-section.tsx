"use client";

import { CheckCircle2Icon, CircleAlertIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDocuments } from "../../hooks/use-documents";
import type { FileSource } from "../../types";

export function SourceTestSection({ source }: { source: FileSource }) {
  const { testSource, testing } = useDocuments();
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-h4 text-foreground">آزمایش اتصال</h2>
        <p className="text-body-sm text-muted-foreground">پیش از همگام‌سازی، اتصال به فایل‌سرور را آزمایش کنید.</p>
      </div>
      <div>
        <Button variant="outline" loading={Boolean(testing[source.id])} onClick={() => void testSource(source.id)}>
          آزمایش اتصال
        </Button>
      </div>
      {source.testResult === "success" ? (
        <Alert variant="success" role="status"><CheckCircle2Icon aria-hidden /><AlertTitle>اتصال برقرار شد</AlertTitle></Alert>
      ) : null}
      {source.testResult === "failed" ? (
        <Alert variant="destructive" role="status">
          <CircleAlertIcon aria-hidden />
          <AlertTitle>اتصال برقرار نشد</AlertTitle>
          <AlertDescription>نشانی سرور، درگاه، مسیر پوشه و حساب کاربری را بررسی کنید و دوباره آزمایش کنید.</AlertDescription>
        </Alert>
      ) : null}
      {source.testResult === "untested" ? (
        <Alert variant="info" role="status"><InfoIcon aria-hidden /><AlertTitle>هنوز آزمایش نشده است</AlertTitle></Alert>
      ) : null}
    </section>
  );
}
