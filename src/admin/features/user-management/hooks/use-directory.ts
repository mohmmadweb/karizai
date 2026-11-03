"use client";

import { useContext } from "react";
import {
  DirectoryContext,
  type DirectoryContextValue,
} from "../components/directory-provider";

export function useDirectory(): DirectoryContextValue {
  const value = useContext(DirectoryContext);
  if (!value) throw new Error("useDirectory must be used inside DirectoryProvider");
  return value;
}
