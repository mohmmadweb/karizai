"use client";

import { useContext } from "react";
import { AccessContext, type AccessContextValue } from "../components/access-provider";

export function useAccess(): AccessContextValue {
  const value = useContext(AccessContext);
  if (!value) throw new Error("useAccess must be used inside AccessProvider");
  return value;
}
