"use client";

import { useState } from "react";

/** Search plus paging for a list kept in React state. */
export function useListView<T>(items: T[], text: (item: T) => string, size = 9) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const needle = query.trim();
  const filtered = needle ? items.filter((item) => text(item).includes(needle)) : items;
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, pageCount);
  return {
    query,
    setQuery: (value: string) => { setQuery(value); setPage(1); },
    page: current,
    setPage,
    pageCount,
    total: filtered.length,
    rows: filtered.slice((current - 1) * size, current * size),
  };
}
