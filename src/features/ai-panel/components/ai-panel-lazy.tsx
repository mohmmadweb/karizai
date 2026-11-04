"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAiPanel } from "./ai-panel-provider";

const AiPanelSheet = dynamic(() => import("./ai-panel-sheet").then((module) => module.AiPanelSheet), { ssr: false });

/** The panel and its markdown code download only when it is first opened, so other pages stay light. */
export function AiPanelLazy() {
  const { open } = useAiPanel();
  const [wanted, setWanted] = useState(false);
  useEffect(() => {
    if (open) setWanted(true);
  }, [open]);
  return wanted ? <AiPanelSheet /> : null;
}
