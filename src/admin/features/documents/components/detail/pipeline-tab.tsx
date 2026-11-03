"use client";

import { CheckCircle2Icon, CircleAlertIcon, CircleDashedIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatNumber } from "@/admin/lib/format";
import { useDocuments } from "../../hooks/use-documents";
import { stepLabel, stepStateLabel } from "../../lib/pipeline";
import type { DocumentRecord, StepState } from "../../types";

function StepIcon({ state }: { state: StepState }) {
  if (state === "done") return <CheckCircle2Icon aria-hidden className="size-5 text-success" />;
  if (state === "error") return <CircleAlertIcon aria-hidden className="size-5 text-destructive" />;
  if (state === "running") return <Spinner aria-hidden className="size-5" />;
  return <CircleDashedIcon aria-hidden className="size-5 text-muted-foreground" />;
}

export function PipelineTab({ doc }: { doc: DocumentRecord }) {
  const { reprocess } = useDocuments();
  const failed = doc.steps.find((s) => s.state === "error");
  return (
    <div className="flex flex-col gap-6">
      {failed ? (
        <Alert variant="destructive">
          <CircleAlertIcon aria-hidden />
          <AlertTitle>پردازش سند با خطا روبه‌رو شد</AlertTitle>
          <AlertDescription>{failed.error}</AlertDescription>
        </Alert>
      ) : null}
      <ol className="flex flex-col divide-y divide-border rounded-xl border border-border" aria-label="مراحل پردازش">
        {doc.steps.map((step) => (
          <li key={step.key} className="flex items-center gap-3 p-3">
            <StepIcon state={step.state} />
            <span className="flex-1 font-medium">{stepLabel(step.key, doc.extension)}</span>
            <span className="text-body-sm text-muted-foreground">{stepStateLabel[step.state]}</span>
          </li>
        ))}
      </ol>
      {doc.status === "ready" && doc.chunkCount !== null ? (
        <p className="text-body-sm text-muted-foreground">تعداد تکه‌های ساخته‌شده: {formatNumber(doc.chunkCount)}</p>
      ) : null}
      <div>
        <Button
          variant="outline"
          disabled={doc.status === "processing"}
          onClick={() => {
            reprocess(doc.id);
            toast.success("پردازش دوباره شروع شد.");
          }}
        >
          <RefreshCwIcon aria-hidden />
          پردازش دوباره
        </Button>
      </div>
    </div>
  );
}
