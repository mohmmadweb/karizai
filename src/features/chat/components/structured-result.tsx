"use client";

import { useState } from "react";
import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DisplayKind, StructuredResult } from "../types";
import { BarChart, LineChart, NumberCard, PieChart } from "./result-charts";
import { downloadCsv, downloadExcel } from "./result-download";

const labels: Record<DisplayKind, string> = { table: "جدول", bar: "میله‌ای", line: "خطی", pie: "دایره‌ای", card: "کارت" };

/** Only the displays that fit the shape of the data are offered. */
function allowedKinds(result: StructuredResult): DisplayKind[] {
  if (result.rows.length === 1 && result.columns.length === 1) return ["card", "table"];
  return ["table", "bar", "line", "pie"];
}

/** Turns the data assistant's structured output into a table, chart, or number card. */
export function StructuredResultView({ result }: { result: StructuredResult }) {
  const [kind, setKind] = useState<DisplayKind>(result.suggested);
  const [showQuery, setShowQuery] = useState(false);
  const kinds = allowedKinds(result);

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-3 rounded-2xl border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="نوع نمایش" className="flex flex-wrap gap-1">
          {kinds.map((item) => (
            <Button key={item} type="button" size="sm" variant={kind === item ? "secondary" : "ghost"} aria-pressed={kind === item} onClick={() => setKind(item)}>{labels[item]}</Button>
          ))}
        </div>
        <div className="flex gap-1">
          <Button type="button" size="sm" variant="ghost" onClick={() => downloadCsv(result)}><DownloadIcon aria-hidden />CSV</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => downloadExcel(result)}><DownloadIcon aria-hidden />Excel</Button>
        </div>
      </div>
      {kind === "table" ? (
        <Table>
          <TableHeader><TableRow>{result.columns.map((column) => <TableHead key={column}>{column}</TableHead>)}</TableRow></TableHeader>
          <TableBody>
            {result.rows.map((row, index) => (
              <TableRow key={index}>{row.map((cell, position) => <TableCell key={position}>{typeof cell === "number" ? formatNumber(cell) : cell}</TableCell>)}</TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
      {kind === "bar" ? <BarChart result={result} /> : null}
      {kind === "line" ? <LineChart result={result} /> : null}
      {kind === "pie" ? <PieChart result={result} /> : null}
      {kind === "card" ? <NumberCard result={result} /> : null}
      <button type="button" onClick={() => setShowQuery((open) => !open)} aria-expanded={showQuery} className={cn("w-fit text-caption text-muted-foreground underline-offset-4 hover:underline")}>
        {showQuery ? "پنهان‌کردن کوئری" : "نمایش کوئری اجراشده"}
      </button>
      {showQuery ? <pre dir="ltr" className="overflow-x-auto rounded-lg bg-muted p-3 text-caption">{result.query}</pre> : null}
    </div>
  );
}
