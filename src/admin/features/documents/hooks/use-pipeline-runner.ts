"use client";

import { useCallback, useEffect, useRef, type Dispatch } from "react";
import { stepKeys, doneSteps } from "../lib/pipeline";
import type { DocumentsAction } from "../lib/documents-reducer";
import type { PipelineStep } from "../types";

const STEP_MS = 650;

type Job = { id: string; fileName: string };

/**
 * Simulated processing: each step takes a moment, a file whose name starts
 * with «error» fails at text extraction. Nothing is read or sent anywhere.
 */
export function usePipelineRunner(dispatch: Dispatch<DocumentsAction>) {
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const cancel = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
  }, []);

  const run = useCallback(
    ({ id, fileName }: Job) => {
      cancel(id);
      const fails = fileName.toLowerCase().startsWith("error");
      const steps = (running: number, doneCount: number, error?: number): PipelineStep[] =>
        stepKeys.map((key, i) => {
          if (error === i) return { key, state: "error", error: "متن فایل خوانده نشد؛ فایل ممکن است خراب یا رمزدار باشد." };
          if (i < doneCount) return { key, state: "done" };
          if (i === running) return { key, state: "running" };
          return { key, state: "pending" };
        });
      const tick = (i: number) => {
        const now = new Date().toISOString();
        if (i >= stepKeys.length) {
          dispatch({ type: "setSteps", id, steps: doneSteps(), chunkCount: 8 + (fileName.length % 40), now });
          timers.current.delete(id);
          return;
        }
        if (fails && i === 1) {
          dispatch({ type: "setSteps", id, steps: steps(-1, 1, 1), now });
          timers.current.delete(id);
          return;
        }
        dispatch({ type: "setSteps", id, steps: steps(i, i), now });
        timers.current.set(id, setTimeout(() => tick(i + 1), STEP_MS));
      };
      timers.current.set(id, setTimeout(() => tick(0), 300));
    },
    [cancel, dispatch],
  );

  return { run, cancel };
}
