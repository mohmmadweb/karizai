import { ArrowDownIcon, ArrowUpIcon, DownloadIcon, FileSpreadsheetIcon, FileTextIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatNumber } from "@/lib/format";
import { downloadDocument, kindLabels, sizeText, type SortDirection, type SortKey } from "../lib/documents";
import type { KnowledgeDocument } from "../types";

export type FileAiAction = "summary" | "ask" | "extract";

type Props = {
  documents: KnowledgeDocument[];
  sortKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
  showFolder: boolean;
  /** Relevance of each document in the semantic search, by id. */
  scores?: Record<string, number>;
  isConfidential: (doc: KnowledgeDocument) => boolean;
  onAi: (doc: KnowledgeDocument, action: FileAiAction) => void;
};

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

const aiActions: { key: FileAiAction; label: string }[] = [{ key: "summary", label: "✦ خلاصه" }, { key: "ask", label: "✦ پرسش" }, { key: "extract", label: "✦ استخراج" }];

/** Documents as file rows: name, kind, smart tags, last change, the three AI actions and download. */
export function DocumentTable({ documents, sortKey, direction, onSort, showFolder, scores, isConfidential, onAi }: Props) {
  const sort = { active: sortKey, direction, onSort };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortHead label="نام" sortKey="title" {...sort} />
          <TableHead className="hidden sm:table-cell">نوع</TableHead>
          <TableHead className="hidden lg:table-cell">برچسب‌های هوشمند</TableHead>
          <SortHead label="آخرین به‌روزرسانی" sortKey="updatedAt" {...sort} className="hidden md:table-cell" />
          <TableHead>عملیات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => {
          const Icon = doc.kind === "excel" ? FileSpreadsheetIcon : FileTextIcon;
          const score = scores?.[doc.id];
          return (
            <TableRow key={doc.id}>
              <TableCell className="whitespace-normal">
                <div className="flex items-center gap-3">
                  <Icon className={`size-5 shrink-0 ${doc.kind === "excel" ? "text-success" : "text-info"}`} aria-hidden />
                  <div className="flex min-w-0 flex-col">
                    <span className="flex flex-wrap items-center gap-1.5 font-medium">
                      {doc.title}
                      {isConfidential(doc) ? <Badge variant="warning"><LockIcon aria-hidden />محرمانه</Badge> : null}
                    </span>
                    <span className="text-caption text-muted-foreground">{showFolder ? `${doc.source} · ` : ""}{sizeText(doc.sizeKb)}</span>
                    {score !== undefined ? <span className="text-caption text-primary">✦ ارتباط {formatNumber(score)}٪ · {doc.summary}</span> : null}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell"><Badge variant="secondary">{kindLabels[doc.kind]}</Badge></TableCell>
              <TableCell className="hidden lg:table-cell">
                <div data-ai className="flex max-w-56 flex-wrap gap-1">{(doc.tags ?? []).map((tag) => <Badge key={tag} variant="info">{tag}</Badge>)}</div>
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">{doc.updatedAt ? formatDate(doc.updatedAt) : "—"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <div data-ai className="flex gap-1">
                    {aiActions.map((action) => (
                      <Button key={action.key} type="button" size="xs" variant="soft" aria-label={`${action.label} ${doc.title}`} onClick={() => onAi(doc, action.key)}>{action.label}</Button>
                    ))}
                  </div>
                  <Button variant="ghost" size="icon-sm" aria-label={`دانلود ${doc.title}`} title="دانلود" onClick={() => { downloadDocument(doc); toast.success("دانلود شروع شد."); }}><DownloadIcon aria-hidden /></Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
