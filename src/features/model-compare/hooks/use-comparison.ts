"use client";

import { useEffect, useRef, useState } from "react";
import type { CatalogModel } from "@/features/model-catalog/types";
import type { CompareTask } from "../data/tasks";
import { estimateRun, type RunMode, type RunResult } from "../lib/estimate";

export type Row = { model: CatalogModel; direct?: RunResult; multi?: RunResult };

/** Runs the chosen models one after another for both modes; each run takes a moment, then shows its figures. */
export function useComparison() {
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function run(models: CatalogModel[], task: CompareTask) {
    if (timer.current) clearTimeout(timer.current);
    const steps = models.flatMap((model) => (["direct", "multi"] as RunMode[]).map((mode) => ({ model, mode })));
    setRows(models.map((model) => ({ model })));
    setRunning(true);
    const next = (index: number) => {
      if (index >= steps.length) { setRunning(false); return; }
      timer.current = setTimeout(() => {
        const { model, mode } = steps[index];
        const result = estimateRun(model, task, mode);
        setRows((current) => current.map((row) => (row.model.id === model.id ? { ...row, [mode]: result } : row)));
        next(index + 1);
      }, 650);
    };
    next(0);
  }

  return { rows, running, run };
}
