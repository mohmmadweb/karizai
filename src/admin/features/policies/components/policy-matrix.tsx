"use client";

import { CheckIcon, InfoIcon, LockIcon, WifiOffIcon, XIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDemoFlags } from "@/lib/demo-flags";
import { locationLabels, sensitivities, sensitivityLabels, type PolicyModel, type Sensitivity } from "../types";

type Props = {
  models: PolicyModel[];
  fallbackName: string;
  onToggle: (modelId: string, level: Sensitivity) => void;
  onEnabledChange: (modelId: string, enabled: boolean) => void;
};

function Cell({ model, level, onToggle }: { model: PolicyModel; level: Sensitivity; onToggle: () => void }) {
  const locked = model.location === "external" && level === "confidential";
  const label = `${model.name} برای داده‌ی ${sensitivityLabels[level]}`;
  if (locked) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={<span tabIndex={0} className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />}
        >
          <LockIcon aria-hidden className="size-4" />
          <span className="sr-only">{label}: مجاز نیست و قفل است</span>
        </TooltipTrigger>
        <TooltipContent>داده‌ی محرمانه هیچ‌وقت به مدل بیرونی نمی‌رود.</TooltipContent>
      </Tooltip>
    );
  }
  const on = model.allowed[level];
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-pressed={on}
      aria-label={`${label}: ${on ? "مجاز" : "مجاز نیست"}`}
      onClick={onToggle}
      className={on ? "text-success" : "text-muted-foreground"}
    >
      {on ? <CheckIcon aria-hidden /> : <XIcon aria-hidden />}
    </Button>
  );
}

/** Model × run location × allowed levels. Agents cannot go around it. */
export function PolicyMatrix({ models, fallbackName, onToggle, onEnabledChange }: Props) {
  const { offline } = useDemoFlags();
  return (
    <section className="flex flex-col gap-4" aria-labelledby="matrix-title">
      <div className="flex flex-col gap-1">
        <h2 id="matrix-title" className="text-h4">مدل‌های مجاز برای هر سطح محرمانگی</h2>
        <p className="text-body-sm text-muted-foreground">
          روی هر خانه بزنید تا مجاز یا نامجاز شود. داده‌ی محرمانه فقط روی سرور GPU سازمان پردازش می‌شود.
        </p>
      </div>
      {offline ? (
        <Alert variant="warning" role="status">
          <WifiOffIcon aria-hidden />
          <AlertTitle>اینترنت قطع است</AlertTitle>
          <AlertDescription>مدل‌های بیرونی در دسترس نیستند؛ همه‌ی درخواست‌ها خودکار به {fallbackName} داخلی می‌روند.</AlertDescription>
        </Alert>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table aria-label="ماتریس سیاست مدل‌ها">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11 px-4 text-label text-muted-foreground">مدل</TableHead>
              <TableHead className="h-11 px-4 text-label text-muted-foreground">محل اجرا</TableHead>
              {sensitivities.map((level) => (
                <TableHead key={level} className="h-11 px-4 text-center text-label text-muted-foreground">
                  {sensitivityLabels[level]}
                </TableHead>
              ))}
              <TableHead className="h-11 px-4 text-label text-muted-foreground">وضعیت</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => {
              const cut = offline && model.location === "external" && model.enabled;
              return (
                <TableRow key={model.id} className="h-14">
                  <TableCell className="px-4 font-medium">
                    <bdi dir="ltr">{model.name}</bdi>
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge variant={model.location === "internal" ? "success" : "info"}>{locationLabels[model.location]}</Badge>
                  </TableCell>
                  {sensitivities.map((level) => (
                    <TableCell key={level} className="px-4 text-center">
                      <Cell model={model} level={level} onToggle={() => onToggle(model.id, level)} />
                    </TableCell>
                  ))}
                  <TableCell className="px-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Switch
                        checked={model.enabled}
                        onCheckedChange={(checked) => onEnabledChange(model.id, checked)}
                        aria-label={`${model.name} برای این سازمان فعال باشد`}
                      />
                      {cut ? (
                        <Badge variant="warning">قطع؛ انتقال به {fallbackName}</Badge>
                      ) : (
                        <span className="text-body-sm text-muted-foreground">
                          {model.enabled ? "فعال" : "غیرفعال برای این سازمان"}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Alert variant="info">
        <InfoIcon aria-hidden />
        <AlertDescription>
          سطح محرمانگی هر منبع داده تعیین می‌کند کدام مدل‌ها مجازند؛ عامل‌ها نمی‌توانند این سیاست را دور بزنند. با قطع مدل
          بیرونی، درخواست خودکار به مدل داخلی منتقل می‌شود.
        </AlertDescription>
      </Alert>
    </section>
  );
}
