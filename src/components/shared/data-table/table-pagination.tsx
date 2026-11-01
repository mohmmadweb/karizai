import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/lib/format";

type TablePaginationProps = {
  total: number;
  /** Zero-based slice bounds of the visible rows. */
  start: number;
  end: number;
  page: number;
  pageCount: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

/** In RTL, "previous" points to the right and "next" to the left. */
export function TablePagination({
  total,
  start,
  end,
  page,
  pageCount,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  return (
    <nav
      aria-label="صفحه‌بندی جدول"
      className="flex flex-col gap-3 border-t border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm text-muted-foreground">
        <span aria-live="polite">
          نمایش {formatNumber(start + 1)} تا {formatNumber(end)} از {formatNumber(total)}
        </span>
        <div className="flex items-center gap-2">
          <span id="page-size-label">تعداد در هر صفحه</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger size="sm" aria-labelledby="page-size-label" className="min-w-16">
              <SelectValue>{(value: string) => formatNumber(Number(value))}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {formatNumber(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="me-2 text-body-sm text-muted-foreground tabular-nums">
          صفحه {formatNumber(page)} از {formatNumber(pageCount)}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="صفحه اول"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
        >
          <ChevronsRightIcon aria-hidden />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="صفحه قبل"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronRightIcon aria-hidden />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="صفحه بعد"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronLeftIcon aria-hidden />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="صفحه آخر"
          disabled={page >= pageCount}
          onClick={() => onPageChange(pageCount)}
        >
          <ChevronsLeftIcon aria-hidden />
        </Button>
      </div>
    </nav>
  );
}
