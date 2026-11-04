"use client";

import { useState } from "react";
import { DownloadIcon, EyeIcon, FileSpreadsheetIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { GeneratedFile } from "../types";
import { downloadGeneratedFile, fileExtension } from "../lib/generated-file-export";

const kinds = {
  word: { icon: FileTextIcon, label: "سند Word", tone: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" },
  excel: { icon: FileSpreadsheetIcon, label: "جدول Excel", tone: "bg-green-500/15 text-green-600 dark:text-green-400" },
};

function Preview({ file }: { file: GeneratedFile }) {
  if (file.kind === "excel") {
    return (
      <Table>
        <TableHeader><TableRow>{(file.columns ?? []).map((column) => <TableHead key={column}>{column}</TableHead>)}</TableRow></TableHeader>
        <TableBody>
          {(file.rows ?? []).map((row, index) => (
            <TableRow key={index}>{row.map((cell, i) => <TableCell key={i}>{typeof cell === "number" ? formatNumber(cell) : cell}</TableCell>)}</TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  return (
    <article className="flex flex-col gap-4 rounded-lg border bg-background p-6 text-body">
      <h3 className="text-h3">{file.title}</h3>
      {(file.sections ?? []).map((section) => (
        <section key={section.heading} className="flex flex-col gap-1">
          <h4 className="text-label">{section.heading}</h4>
          {section.lines.map((line) => <p key={line} className="text-muted-foreground">{line}</p>)}
        </section>
      ))}
    </article>
  );
}

/** Cards for the Word and Excel files the assistant prepared, each with a preview and a download. */
export function GeneratedFilesView({ files }: { files: GeneratedFile[] }) {
  const [open, setOpen] = useState<GeneratedFile | null>(null);
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-2">
      <ul className="grid min-w-0 gap-2 sm:grid-cols-2">
        {files.map((file) => {
          const { icon: Icon, label, tone } = kinds[file.kind];
          return (
            <li key={file.id} className="flex min-w-0 items-center gap-3 rounded-2xl border bg-card p-3">
              <span aria-hidden className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", tone)}><Icon className="size-6" /></span>
              <div className="min-w-0 flex-1">
                <p className="flex min-w-0 items-baseline gap-0.5 text-label"><span className="truncate">{file.name}</span><span dir="ltr" className="shrink-0 text-muted-foreground">.{fileExtension(file)}</span></p>
                <p className="text-caption text-muted-foreground">{label}</p>
              </div>
              <Button variant="ghost" size="icon-sm" aria-label={`پیش‌نمایش ${file.name}`} onClick={() => setOpen(file)}><EyeIcon aria-hidden /></Button>
              <Button variant="outline" size="icon-sm" aria-label={`دانلود ${file.name}`} onClick={() => downloadGeneratedFile(file)}><DownloadIcon aria-hidden /></Button>
            </li>
          );
        })}
      </ul>
      <Dialog open={open !== null} onOpenChange={(value) => { if (!value) setOpen(null); }}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{open?.title}</DialogTitle>
            <DialogDescription>پیش‌نمایش فایل پیش از دانلود</DialogDescription>
          </DialogHeader>
          {open ? <Preview file={open} /> : null}
          {open ? <Button className="w-fit" onClick={() => downloadGeneratedFile(open)}><DownloadIcon aria-hidden />دانلود</Button> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
