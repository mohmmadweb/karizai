"use client";

import { useState } from "react";

/** Temporary page state. The page is clamped when the row count shrinks. */
export function usePagination(total: number, initialPageSize: number) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pageCount);
  const start = total === 0 ? 0 : (current - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  return {
    page: current,
    pageSize,
    pageCount,
    /** Zero-based slice bounds. */
    start,
    end,
    setPage: (next: number) => setPage(Math.min(Math.max(1, next), pageCount)),
    setPageSize: (size: number) => {
      setPageSizeState(size);
      setPage(1);
    },
  };
}
