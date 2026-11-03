"use client";

import { useEffect, useRef, useState } from "react";
import type { Limits } from "../data/limits";
import { limitKeys } from "../data/limits";

/**
 * Simulated live load per row: every 1.5 seconds each share drifts a little.
 * During a «peak» it climbs past 1, which the page turns into throttle events.
 */
export function useLiveLoad(ids: string[], start: (index: number) => Limits, peak: boolean) {
  const [load, setLoad] = useState<Record<string, Limits>>(() => Object.fromEntries(ids.map((id, i) => [id, start(i)])));
  const peakRef = useRef(peak);
  useEffect(() => {
    peakRef.current = peak;
  }, [peak]);
  const key = ids.join("|");
  useEffect(() => {
    const timer = setInterval(() => {
      setLoad((current) => {
        const next: Record<string, Limits> = {};
        key.split("|").forEach((id, i) => {
          const was = current[id] ?? start(i);
          const row = { ...was };
          for (const k of limitKeys) {
            const drift = (Math.random() - 0.5) * 0.08 + (peakRef.current ? 0.09 : (start(i)[k] - was[k]) * 0.2);
            row[k] = Math.max(0.05, Math.min(peakRef.current ? 1.08 : 0.97, was[k] + drift));
          }
          next[id] = row;
        });
        return next;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [key, start]);
  return load;
}
