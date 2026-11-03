"use client";

import { useState } from "react";
import { ChartColumnIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber } from "@/lib/format";
import { simulateRequest } from "@/lib/simulate-request";
import { findDataAnswer, getDashboards, getDataAnswers } from "../data/answers";
import type { DataAnswer } from "../types";
import { DataResult } from "./data-result";

/** «داده و تحلیل»: questions in plain Persian over the production data warehouse; read-only and row-level limited. */
export function DataPageContent() {
  const samples = getDataAnswers();
  const [question, setQuestion] = useState(samples[0].question);
  const [answer, setAnswer] = useState<DataAnswer | null>(samples[0]);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboards, setDashboards] = useState(getDashboards);

  async function ask(text = question) {
    if (!text.trim()) return;
    setQuestion(text);
    setLoading(true);
    await simulateRequest(900);
    const found = findDataAnswer(text);
    setAnswer(found ?? null);
    setMissing(!found);
    setLoading(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader
        title="داده و تحلیل"
        description="پرسش از داده‌های سازمان به زبان ساده؛ فقط‌خواندنی و با قواعد دسترسی سطری."
        action={<div className="flex flex-wrap gap-2"><Badge variant="secondary">منبع: انبار داده تولید (SQL Server)</Badge><Badge variant="success">لایه معنایی: {formatNumber(84)} اصطلاح</Badge></div>}
      />
      <Card data-ai>
        <CardContent className="flex flex-col gap-4">
          <form className="flex flex-col gap-3" onSubmit={(event) => { event.preventDefault(); void ask(); }}>
            <label htmlFor="bi-question" className="text-label">پرسش شما</label>
            <Textarea id="bi-question" value={question} onChange={(event) => setQuestion(event.target.value)} rows={2} />
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">✦ دستیار هوش تجاری</Badge>
              <span className="text-caption text-muted-foreground">نمونه:</span>
              {samples.map((item) => (
                <Button key={item.id} type="button" size="xs" variant="ghost" onClick={() => void ask(item.question)}>{item.chartTitle.replace(/ \(.*\)$/, "")}</Button>
              ))}
              <Button type="submit" size="sm" className="ms-auto" loading={loading}>پرسیدن</Button>
            </div>
          </form>
          {missing ? <p className="text-body-sm text-muted-foreground" aria-live="polite">برای این پرسش داده‌ای در بخش‌های مجاز شما پیدا نشد. نام شاخص و بازه را دقیق‌تر بنویسید؛ مثلاً «{samples[0].question}»</p> : null}
          {answer && !loading ? <DataResult answer={answer} dashboards={dashboards} onAddToDashboard={(id) => setDashboards((list) => list.map((item) => (item.id === id ? { ...item, charts: item.charts + 1 } : item)))} /> : null}
        </CardContent>
      </Card>
      <section className="flex flex-col gap-3" aria-label="داشبوردهای من">
        <h2 className="text-h4">داشبوردهای من</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {dashboards.map((item) => (
            <li key={item.id}>
              <Card size="sm"><CardContent className="flex items-center gap-3">
                <ChartColumnIcon className="size-6 shrink-0 text-primary" aria-hidden />
                <div className="flex flex-col"><span className="text-label">{item.name}</span><span className="text-caption text-muted-foreground">{formatNumber(item.charts)} نمودار{item.note ? ` · ${item.note}` : ""}</span></div>
              </CardContent></Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
