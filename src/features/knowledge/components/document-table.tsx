import { ArrowDownIcon, ArrowUpIcon, DownloadIcon, FileSpreadsheetIcon, FileTextIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { downloadDocument, kindLabels, sizeText, type SortDirection, type SortKey } from "../lib/documents";
import type { KnowledgeDocument } from "../types";

type Props = { documents: KnowledgeDocument[]; sortKey: SortKey; direction: SortDirection; onSort: (key: SortKey) => void; showFolder: boolean };

function SortHead({ label, sortKey, active, direction, onSort, className }: { label: string; sortKey: SortKey; active: SortKey; direction: SortDirection; onSort: (key: SortKey) => void; className?: string }) {
  const on = active === sortKey;
  return (
    <TableHead className={className} aria-sort={on ? (direction === "asc" ? "ascending" : "descending") : "none"}>
      <button type="button" onClick={() => onSort(sortKey)} className="inline-flex min-h-9 items-center gap-1 rounded-sm outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
        {label}
        {on ? (direction === "asc" ? <ArrowUpIcon className="size-3.5" aria-hidden /> : <ArrowDownIcon className="size-3.5" aria-hidden />) : null}
      </button>
    </TableHead>
  );
}

/** Documents as file rows: icon and name, kind, size, last change, and a download button. */
export function DocumentTable({ documents, sortKey, direction, onSort, showFolder }: Props) {
  const sort = { active: sortKey, direction, onSort };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortHead label="نام" sortKey="title" {...sort} />
          <TableHead className="hidden sm:table-cell">نوع</TableHead>
          <SortHead label="حجم" sortKey="sizeKb" {...sort} className="hidden md:table-cell" />
          <SortHead label="آخرین به‌روزرسانی" sortKey="updatedAt" {...sort} className="hidden sm:table-cell" />
          <TableHead className="w-12"><span className="sr-only">دانلود</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => {
          const Icon = doc.kind === "excel" ? FileSpreadsheetIcon : FileTextIcon;
          return (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Icon className={`size-5 shrink-0 ${doc.kind === "excel" ? "text-success" : "text-info"}`} aria-hidden />
                  <div className="flex min-w-0 flex-col">
                    <span className="font-medium">{doc.title}</span>
                    <span className="text-caption text-muted-foreground">{showFolder ? `${doc.source} · ` : ""}{doc.collection}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell"><Badge variant="secondary">{kindLabels[doc.kind]}</Badge></TableCell>
              <TableCell className="hidden tabular-nums text-muted-foreground md:table-cell">{sizeText(doc.sizeKb)}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">{doc.updatedAt ? formatDate(doc.updatedAt) : "—"}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" aria-label={`دانلود ${doc.title}`} title="دانلود" onClick={() => { downloadDocument(doc); toast.success("دانلود شروع شد."); }}><DownloadIcon aria-hidden /></Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
