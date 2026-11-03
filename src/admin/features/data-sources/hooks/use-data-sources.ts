"use client";

import { useContext } from "react";
import {
  DataSourcesContext,
  type DataSourcesContextValue,
} from "../components/data-sources-provider";

export function useDataSources(): DataSourcesContextValue {
  const value = useContext(DataSourcesContext);
  if (!value) throw new Error("useDataSources must be used inside DataSourcesProvider");
  return value;
}
