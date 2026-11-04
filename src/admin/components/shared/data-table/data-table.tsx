"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { RowActions } from "./row-actions";
import { TablePagination } from "@/components/shared/data-table/table-pagination";
import type { DataTableActionGroup, DataTableColumn } from "./types";
import { usePagination } from "@/components/shared/data-table/use-pagination";

type DataTableProps<T> = {
  /** Describes the table for assistive technology. */
  label: string;
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  /** Plain-text name of a row, used to label its actions. */
  getRowLabel: (row: T) => string;
  getRowActions?: (row: T) => DataTableActionGroup[];
  /** Phone layout for one row. When omitted, the table scrolls sideways. */
  renderCard?: (row: T, actions: ReactNode) => ReactNode;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  /** A summary row kept after the last visible row on every page, such as a total. */
  totalRow?: T;
  /** Short lists: leave out the page controls while everything fits on one page. */
  hidePagerWhenSingle?: boolean;
};

const hideClass = {
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
} as const;

/**
 * Table from `md` up (cards below when `renderCard` is given) with a row
 * actions menu and pagination. Page state is temporary and lives in the browser.
 */
export function DataTable<T>({
  label,
  rows,
  columns,
  getRowId,
  getRowLabel,
  getRowActions,
  renderCard,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
  totalRow,
  hidePagerWhenSingle = false,
}: DataTableProps<T>) {
  const pagination = usePagination(rows.length, defaultPageSize);
  const pageRows = rows.slice(pagination.start, pagination.end);
  const actionsOf = (row: T) =>
    getRowActions ? (
      <RowActions rowLabel={getRowLabel(row)} groups={getRowActions(row)} />
    ) : null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className={cn(renderCard && "hidden md:block")}>
        <Table aria-label={label}>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    "h-11 px-4 text-label text-muted-foreground",
                    column.align === "end" && "text-end",
                    column.hideBelow && hideClass[column.hideBelow],
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
              {getRowActions ? (
                <TableHead className="w-px px-4">
                  <span className="sr-only">عملیات</span>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={getRowId(row)} className="h-14">
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={cn(
                      "px-4",
                      column.align === "end" && "text-end tabular-nums",
                      column.hideBelow && hideClass[column.hideBelow],
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
                {getRowActions ? (
                  <TableCell className="w-px px-4 text-end">{actionsOf(row)}</TableCell>
                ) : null}
              </TableRow>
            ))}
            {totalRow ? (
              <TableRow className="h-14 bg-muted/40 font-semibold hover:bg-muted/40">
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={cn(
                      "px-4",
                      column.align === "end" && "text-end tabular-nums",
                      column.hideBelow && hideClass[column.hideBelow],
                    )}
                  >
                    {column.cell(totalRow)}
                  </TableCell>
                ))}
                {getRowActions ? <TableCell className="w-px px-4" /> : null}
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
      {renderCard ? (
        <ul className="flex flex-col gap-3 p-3 md:hidden">
          {pageRows.map((row) => (
            <li key={getRowId(row)}>
              <Card className="gap-3 p-4 shadow-none">{renderCard(row, actionsOf(row))}</Card>
            </li>
          ))}
          {totalRow ? (
            <li>
              <Card className="gap-3 bg-muted/40 p-4 font-semibold shadow-none">
                {renderCard(totalRow, null)}
              </Card>
            </li>
          ) : null}
        </ul>
      ) : null}
      {hidePagerWhenSingle && pagination.pageCount === 1 ? null : <TablePagination
        total={rows.length}
        start={pagination.start}
        end={pagination.end}
        page={pagination.page}
        pageCount={pagination.pageCount}
        pageSize={pagination.pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setPageSize}
      />}
    </div>
  );
}
