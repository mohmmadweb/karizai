"use client";

import { useAiPanel } from "./ai-panel-provider";

/**
 * «نمایش لایه AI»: everything marked with `data-ai` gets a dashed outline and a small label.
 * Fixed and absolute elements keep their position; only the outline is drawn on them.
 */
const css = `
[data-ai] { outline: 2px dashed var(--chart-4); outline-offset: 3px; border-radius: 10px; }
[data-ai]:not(.fixed):not(.absolute) { position: relative; }
[data-ai]:not(.fixed):not(.absolute)::before {
  content: "✦ کاریز AI";
  position: absolute;
  top: -0.7rem;
  inset-inline-end: 0.5rem;
  z-index: 2;
  padding: 0 0.375rem;
  border-radius: 6px;
  background: var(--chart-4);
  color: var(--background);
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  white-space: nowrap;
  pointer-events: none;
}
`;

export function AiLayerStyle() {
  const { aiLayer } = useAiPanel();
  return aiLayer ? <style>{css}</style> : null;
}
