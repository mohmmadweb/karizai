"use client";

import { useEffect, useMemo, useState } from "react";
import { PlayIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { formatNumber } from "@/admin/lib/format";
import { estimateTokens, scoreComplexity, tierLabels } from "@/lib/smart-routing";
import { presets } from "../data/presets";
import { costOf, planRun, winnerOf, type Mode, type Planned } from "../lib/plan";
import { ResultsTable } from "./results-table";

/** Animation runs twice as fast as the measured times shown in the table. */
const SPEED = 2;

/** Same question, same conditions, several models: direct or multi-agent, with live TTFT, E2E, tokens, cost and supervisor score. */
export function BenchmarkPageContent() {
  const { models } = useModels();
  const enabled = models.filter((m) => m.enabled);
  const [presetId, setPresetId] = useState(presets[0].id);
  const [prompt, setPrompt] = useState(presets[0].prompt);
  const [selected, setSelected] = useState<string[]>(() => enabled.slice(0, 3).map((m) => m.id));
  const [mode, setMode] = useState<Mode>("direct");
  const [rows, setRows] = useState<Planned[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const preset = presets.find((p) => p.id === presetId)!;
  const complexity = scoreComplexity(prompt);

  const estimates = useMemo(() => {
    const t = estimateTokens(prompt, complexity.tier);
    const factor = mode === "multi" ? 2.6 : 1;
    return Object.fromEntries(enabled.map((m) => [m.id, costOf(t.input * factor, t.output * factor, m)]));
  }, [enabled, prompt, complexity.tier, mode]);

  useEffect(() => {
    if (!running) return;
    const end = Math.max(...rows.map((r) => r.e2eMs)) + 700;
    const timer = setInterval(() => {
      setElapsed((e) => {
        const next = e + 100 * SPEED;
        if (next >= end) { setRunning(false); return end; }
        return next;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [running, rows]);

  function run() {
    setRows(enabled.filter((m) => selected.includes(m.id)).map((m) => planRun(m, preset, prompt, mode)));
    setElapsed(0);
    setRunning(true);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="آزمون مقایسه‌ای" description="یک پرسش را با شرایط یکسان روی چند مدل، مستقیم یا چندعاملی، اجرا کنید و سرعت، هزینه و کیفیت را کنار هم ببینید." />
      <Card>
        <CardHeader><CardTitle>پرسش و شرایط</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div role="group" aria-label="پرسش‌های آماده" className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <Button key={p.id} size="sm" variant={p.id === presetId ? "default" : "outline"} aria-pressed={p.id === presetId} onClick={() => { setPresetId(p.id); setPrompt(p.prompt); }}>{p.title}</Button>
            ))}
          </div>
          <Field>
            <FieldLabel htmlFor="bench-prompt">پرسش</FieldLabel>
            <Textarea id="bench-prompt" rows={3} value={prompt} onChange={(event) => setPrompt(event.target.value)} />
            <p className="text-caption text-muted-foreground">✦ مسیریاب این پرسش را «{tierLabels[complexity.tier]}» می‌داند ({complexity.reasons.join("، ")}).</p>
          </Field>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-label">مدل‌ها ({formatNumber(selected.length)} انتخاب)</legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {enabled.map((m) => (
                <label key={m.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-body-sm">
                  <Checkbox checked={selected.includes(m.id)} onCheckedChange={(checked) => setSelected((list) => (checked ? [...list, m.id] : list.filter((id) => id !== m.id)))} />
                  <span className="flex-1">{m.displayName}{m.selfHosted ? " · داخلی" : ""}</span>
                  <span className="tabular-nums text-caption text-muted-foreground">≈ {formatNumber(Math.round(estimates[m.id] ?? 0))} تومان</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="حالت اجرا" className="flex gap-2">
              {(["direct", "multi"] as const).map((m) => (
                <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} aria-pressed={mode === m} onClick={() => setMode(m)}>{m === "direct" ? "مستقیم" : "چندعاملی"}</Button>
              ))}
            </div>
            <Button loading={running} disabled={selected.length === 0 || !prompt.trim()} onClick={run}><PlayIcon aria-hidden />اجرا</Button>
          </div>
        </CardContent>
      </Card>
      {rows.length > 0 ? (
        <section className="flex flex-col gap-3" aria-label="نتیجه">
          <h2 className="text-h3">نتیجه ({mode === "multi" ? "چندعاملی" : "مستقیم"})</h2>
          <ResultsTable rows={rows} elapsed={elapsed} estimates={estimates} winner={winnerOf(rows)} />
          <p className="text-caption text-muted-foreground">برنده با همان وزن مسیریاب پیش‌فرض انتخاب می‌شود: نیمی کیفیت، یک‌چهارم سرعت و یک‌چهارم هزینه. هزینه با نرخ هر هزار توکن (داخلی ۴۰ و بیرونی ۹۰۰ تومان) حساب شده است.</p>
        </section>
      ) : null}
    </div>
  );
}
