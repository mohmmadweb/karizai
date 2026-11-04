"use client";

import { useState } from "react";
import { CrownIcon, FlaskConicalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { formatCost } from "@/admin/features/usage-report/lib/format-rows";
import { formatNumber } from "@/admin/lib/format";
import { cn } from "@/lib/utils";
import { pickModel, rankOptions, scoreComplexity, tierLabels, type RouteOption, type RoutePick, type RoutableModel, type RouterMember, type SmartRouter } from "@/lib/smart-routing";
import { getModelProfile, routingPrice } from "../data/model-profiles";

type Result = { pick: RoutePick; options: RouteOption[] };

/** Try a sample question and see which model this router would choose, why, and what each option would cost. */
export function RouterTestPanel({ router }: { router: SmartRouter }) {
  const { models, providers } = useModels();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function test() {
    const routable: RoutableModel[] = models
      .filter((m) => m.enabled)
      .map((m) => {
        const profile = getModelProfile(m);
        const price = routingPrice(m);
        return { id: m.id, name: m.displayName, isAvailable: providers.find((p) => p.id === m.providerId)?.status !== "unavailable", supportsImages: m.supportsImages, supportsTools: m.supportsTools, quality: profile.quality, tokensPerSecond: profile.tokensPerSecond, costInputPerMillion: price.input, costOutputPerMillion: price.output };
      });
    const pick = pickModel(router, routable, prompt);
    const usable = router.members
      .map((member) => ({ member, model: routable.find((m) => m.id === member.modelId) }))
      .filter((item): item is { member: RouterMember; model: RoutableModel } => Boolean(item.model?.isAvailable));
    setResult({ pick, options: rankOptions(router, usable, scoreComplexity(prompt), prompt) });
  }

  const chosenId = result?.pick.ok ? result.pick.model.id : null;

  return (
    <div className="flex flex-col gap-3">
      <Field>
        <FieldLabel htmlFor="router-test">پرسش نمونه</FieldLabel>
        <Textarea id="router-test" rows={3} value={prompt} onChange={(event) => { setPrompt(event.target.value); setResult(null); }} placeholder="مثلاً: علت مردودی بچ B-1405-212 در آزمون MFI را تحلیل کن" />
        <FieldDescription>فقط مدل‌های فعال این مسیریاب که الان در دسترس‌اند در نظر گرفته می‌شوند.</FieldDescription>
      </Field>
      <Button type="button" variant="outline" className="w-fit" disabled={!prompt.trim()} onClick={test}><FlaskConicalIcon aria-hidden />آزمایش مسیریاب</Button>
      {result ? <p role="status" className="rounded-lg border bg-muted/40 p-3 text-body-sm">{result.pick.reason}</p> : null}
      {result && result.options.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table aria-label="هزینه‌ی تخمینی هر گزینه">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4">گزینه</TableHead>
                <TableHead className="px-4">سطح</TableHead>
                <TableHead className="px-4 text-end">توکن تخمینی</TableHead>
                <TableHead className="px-4 text-end">هزینه‌ی تخمینی</TableHead>
                <TableHead className="px-4 text-end">کیفیت / سرعت / هزینه</TableHead>
                <TableHead className="px-4 text-end">امتیاز وزنی</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.options.map((option, i) => (
                <TableRow key={`${option.model.id}-${i}`} className={cn("h-12", option.model.id === chosenId && "bg-primary/5")}>
                  <TableCell className="px-4">
                    <span className="flex flex-wrap items-center gap-2 font-medium">
                      {option.model.name}
                      {option.model.id === chosenId ? <Badge variant="success"><CrownIcon aria-hidden />انتخاب مسیریاب</Badge> : null}
                    </span>
                  </TableCell>
                  <TableCell className="px-4">{tierLabels[option.tier]}{option.distance === 0 ? null : <span className="text-caption text-muted-foreground"> (نزدیک‌ترین)</span>}</TableCell>
                  <TableCell className="px-4 text-end tabular-nums">{formatNumber(option.tokens.input + option.tokens.output)}</TableCell>
                  <TableCell className="px-4 text-end tabular-nums">{option.estimatedCost === null ? "ثبت نشده" : formatCost(option.estimatedCost)}</TableCell>
                  <TableCell className="px-4 text-end tabular-nums text-muted-foreground">{formatNumber(option.scores.quality)} / {formatNumber(option.scores.speed)} / {formatNumber(option.scores.cost)}</TableCell>
                  <TableCell className="px-4 text-end font-semibold tabular-nums">{formatNumber(option.weighted)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
      {result ? <p className="text-caption text-muted-foreground">هزینه‌ی مدل‌های داخلی، سهم برق و سخت‌افزار سرور سازمان است. اول سطح پرسش مدل را تعیین می‌کند؛ میان گزینه‌های هم‌سطح، امتیاز وزنی برنده را انتخاب می‌کند.</p> : null}
    </div>
  );
}
