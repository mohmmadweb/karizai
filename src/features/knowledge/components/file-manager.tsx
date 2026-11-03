"use client";

import { useMemo, useRef, useState } from "react";
import { FolderPlusIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { useAiPanel } from "@/features/ai-panel/components/ai-panel-provider";
import { formatNumber } from "@/lib/format";
import { usePolicies } from "@/lib/policy-store";
import { isConfidentialDocument } from "../data/documents";
import { folderAnswer, metaAnswer, summaryAnswer } from "../lib/ai-answers";
import { folderCounts, semanticSearch, sortDocuments, type SortDirection, type SortKey } from "../lib/documents";
import type { DocumentKind, KnowledgeDocument } from "../types";
import { DocumentTable, type FileAiAction } from "./document-table";
import { FolderList } from "./folder-list";
import { NewFolderDialog } from "./new-folder-dialog";

const uploadKinds: Record<string, DocumentKind> = { pdf: "pdf", doc: "word", docx: "word", xls: "excel", xlsx: "excel" };

/** Folders and files with name or semantic search, smart tags and the AI actions. Added folders, files and tags are temporary. */
export function FileManager({ initial }: { initial: KnowledgeDocument[] }) {
  const { openPanel } = useAiPanel();
  const { confidentialDocIds } = usePolicies();
  const [documents, setDocuments] = useState(initial);
  const [folders, setFolders] = useState<string[]>([]);
  const [folder, setFolder] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [semantic, setSemantic] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [direction, setDirection] = useState<SortDirection>("desc");
  const [folderOpen, setFolderOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const counter = useRef(0);

  const allFolders = useMemo(() => folderCounts(documents, folders), [documents, folders]);
  const inFolder = useMemo(() => documents.filter((doc) => folder === null || doc.source === folder), [documents, folder]);
  const ranked = useMemo(() => (semantic && query.trim() ? semanticSearch(inFolder, query) : null), [semantic, query, inFolder]);
  const shown = ranked ? ranked.map((item) => item.doc) : sortDocuments(inFolder.filter((doc) => `${doc.title} ${doc.source} ${doc.collection}`.includes(query.trim())), sortKey, direction);
  const scores = ranked ? Object.fromEntries(ranked.map((item) => [item.doc.id, item.score])) : undefined;
  const folderName = folder ?? "همه‌ی اسناد";

  function sortBy(key: SortKey) {
    if (key === sortKey) setDirection(direction === "asc" ? "desc" : "asc");
    else { setSortKey(key); setDirection(key === "title" ? "asc" : "desc"); }
  }

  function saveTags(id: string, tags: string[]) {
    setDocuments((list) => list.map((doc) => (doc.id === id ? { ...doc, tags: [...new Set([...(doc.tags ?? []), ...tags])] } : doc)));
  }

  function runAi(doc: KnowledgeDocument, action: FileAiAction) {
    if (action === "summary") openPanel({ context: doc.title, question: `خلاصه‌ی «${doc.title}»`, answer: summaryAnswer(doc) });
    else if (action === "extract") openPanel({ context: doc.title, question: `استخراج اطلاعات «${doc.title}»`, answer: metaAnswer(doc, (tags) => saveTags(doc.id, tags)) });
    else openPanel({ context: doc.title });
  }

  function upload(files: FileList) {
    for (const file of Array.from(files)) {
      const kind = uploadKinds[file.name.split(".").pop()?.toLowerCase() ?? ""];
      if (!kind) { toast.error(`فایل «${file.name}» پذیرفته نشد. فقط PDF، Word و Excel.`); continue; }
      const title = file.name.replace(/\.[^.]+$/, "");
      setDocuments((list) => [{ id: `doc-up-${++counter.current}`, title, source: folder ?? "پوشه‌ی من", collection: "بارگذاری‌شده", kind, sizeKb: Math.max(1, Math.round(file.size / 1024)), updatedAt: new Date().toISOString() }, ...list]);
      toast.success(`«${title}» بارگذاری شد.`, { description: "این فایل فقط تا تازه‌کردن صفحه نگه داشته می‌شود." });
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[14rem_minmax(0,1fr)]">
      <FolderList folders={allFolders} total={documents.length} selected={folder} onSelect={setFolder} />
      <section aria-label="اسناد" className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div data-ai className="flex min-w-0 flex-1 items-center gap-2 rounded-lg">
            <SearchField value={query} onValueChange={setQuery} label={semantic ? "جستجوی معنایی" : "جست‌وجو در اسناد"} placeholder={semantic ? "سندی که درباره رطوبت مواد ورودی است" : "جست‌وجو در اسناد"} className="sm:max-w-none" />
            <Button type="button" size="sm" variant={semantic ? "default" : "soft"} aria-pressed={semantic} onClick={() => setSemantic(!semantic)} className="shrink-0">✦ جستجوی معنایی</Button>
          </div>
          <Button data-ai type="button" size="sm" variant="soft" onClick={() => openPanel({ context: folderName, question: `خلاصه‌ی ${folderName}`, answer: folderAnswer(folderName, inFolder) })}>✦ خلاصه این پوشه</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setFolderOpen(true)}><FolderPlusIcon aria-hidden />پوشه جدید</Button>
          <Button type="button" size="sm" onClick={() => fileRef.current?.click()}><UploadIcon aria-hidden />آپلود فایل</Button>
          <input ref={fileRef} type="file" multiple hidden accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => { if (event.target.files) upload(event.target.files); event.target.value = ""; }} />
        </div>
        <p className="text-body-sm text-muted-foreground" aria-live="polite">{folderName} · {formatNumber(shown.length)} سند{ranked ? " · به ترتیب ارتباط معنایی" : ""}</p>
        {shown.length === 0
          ? <p className="py-6 text-center text-body text-muted-foreground">{folder && inFolder.length === 0 ? "این پوشه خالی است. فایلی آپلود کنید." : "سندی پیدا نشد."}</p>
          : <div className="rounded-xl border bg-card"><DocumentTable documents={shown} sortKey={sortKey} direction={direction} onSort={sortBy} showFolder={folder === null} scores={scores} isConfidential={(doc) => isConfidentialDocument(doc, confidentialDocIds)} onAi={runAi} /></div>}
      </section>
      <NewFolderDialog open={folderOpen} onOpenChange={setFolderOpen} existing={allFolders.map((item) => item.name)} onCreate={(name) => { setFolders((list) => [...list, name]); setFolder(name); }} />
    </div>
  );
}
