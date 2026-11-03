"use client";

import { useContext } from "react";
import { ModelsContext, type ModelsContextValue } from "../components/models-provider";

export function useModels(): ModelsContextValue {
  const value = useContext(ModelsContext);
  if (!value) throw new Error("useModels must be used inside ModelsProvider");
  return value;
}
