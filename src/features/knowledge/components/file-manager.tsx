"use client";

import { useMemo, useRef, useState } from "react";
import { FolderIcon, FolderPlusIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { DashedEmpty, FilterPill, MotoPage, MotoPageHeader, MotoSearch, StatusTabs } from "@/components/shared/moto/moto";
import { Button } from "@/components/ui/button";
import { useAiPanel } from "@/features/ai-panel/components/ai-panel-provider";
import { formatNumber } from "@/lib/format";
import { usePolicies } from "@/features/policies/components/policies-provider";
import { isConfidentialDocument } from "../data/documents";
import { folderAnswer, metaAnswer, summaryAnswer } from "../lib/ai-answers";
import { folderCounts, semanticSearch, sortDocuments, type SortDirection, type SortKey } from "../lib/documents";
import type { DocumentKind, KnowledgeDocument } from "../types";
import { CollectionCards } from "./collection-cards";
import { DocumentTable, type FileAiAction } from "./document-table";
import { useKnowledgeFiles } from "./knowledge-files-provider";
import { NewFolderDialog } from "./new-folder-dialog";

const uploadKinds: Record<string, DocumentKind> = { pdf: "pdf", doc: "word", docx: "word", xls: "excel", xlsx: "excel" };

/** Folders and files with name or semantic search, smart tags and the AI actions. Added folders, files and tags (and files made by AI) are temporary. */
export function FileManager({ initial, onAskAll }: { initial: KnowledgeDocument[]; /** The «✦ پرسش از کل دانش» button of the page header. */ onAskAll: () => void }) {
  const { openPanel } = useAiPanel();
  const policies = usePolicies();
  // Files Agents and workflows made in this visit join the list, newest on top, also while the page is open.
  const { generated } = useKnowledgeFiles();
  const [documents, setDocuments] = useState(() => [...generated, ...initial]);
  const [seenGenerated, setSeenGenerated] = useState(generated.length);
  if (generated.length !== seenGenerated) {
    const fresh = generated.slice(0, generated.length - seenGenerated);
    setSeenGenerated(generated.length);
    setDocuments((list) => [...fresh.filter((doc) => !list.some((item) => item.id === doc.id)), ...list]);
  }
  const [folders, setFolders] = useState<string[]>([]);
  const [folder, setFolder] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [semantic, setSemantic] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [direction, setDirection] = useState<SortDirection>("desc");
  const [folderOpen, setFolderOpen] = useState(false);
  const [tab, setTab] = useState<"files" | "collections">("files");
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

  const folderOptions = [{ value: "", label: `همه‌ی پوشه‌ها (${formatNumber(documents.length)})` }, ...allFolders.map((item) => ({ value: item.name, label: `${item.name} (${formatNumber(item.count)})` }))];

  return (
    <MotoPage>
      <MotoPageHeader
        title="مدیریت فایل‌های من"
        icon={FolderIcon}
        description="فایل‌ها و مجموعه‌هایی که به آن‌ها دسترسی دارید؛ دسترسی از سامانه‌ی مبدأ به ارث می‌رسد."
        action={<>
          <Button data-ai type="button" className="h-10" onClick={onAskAll}>✦ پرسش از کل دانش</Button>
          <Button type="button" variant="soft" className="h-10" onClick={() => setFolderOpen(true)}><FolderPlusIcon aria-hidden />پوشه جدید</Button>
          <Button type="button" className="h-10" onClick={() => fileRef.current?.click()}><UploadIcon aria-hidden />آپلود فایل</Button>
          <input ref={fileRef} type="file" multiple hidden accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => { if (event.target.files) upload(event.target.files); event.target.value = ""; }} />
        </>}
      />
      <StatusTabs label="بخش دانش" value={tab} onChange={setTab} options={[{ value: "files", label: "فایل‌ها" }, { value: "collections", label: "مجموعه‌ها" }]} />
      {tab === "collections" ? <CollectionCards /> : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <MotoSearch value={query} onChange={setQuery} placeholder={semantic ? "سندی که درباره رطوبت مواد ورودی است" : "جستجو"} className="sm:max-w-md" />
            <FilterPill label="پوشه" value={folder ?? ""} options={folderOptions} onChange={(value) => setFolder(value === "" ? null : value)} />
            <div data-ai className="flex flex-wrap items-center gap-2 sm:ms-auto">
              <Button type="button" size="sm" variant={semantic ? "default" : "soft"} aria-pressed={semantic} onClick={() => setSemantic(!semantic)}>✦ جستجوی معنایی</Button>
              <Button data-ai type="button" size="sm" variant="soft" onClick={() => openPanel({ context: folderName, question: `خلاصه‌ی ${folderName}`, answer: folderAnswer(folderName, inFolder) })}>✦ خلاصه این پوشه</Button>
            </div>
          </div>
          <p className="text-body-sm text-muted-foreground" aria-live="polite">{folderName} · {formatNumber(shown.length)} سند{ranked ? " · به ترتیب ارتباط معنایی" : ""}</p>
          {shown.length === 0
            ? <DashedEmpty title={folder && inFolder.length === 0 ? "این پوشه خالی است" : "سندی پیدا نشد"} description={folder && inFolder.length === 0 ? "یک پوشه جدید بسازید یا فایل آپلود کنید" : undefined} />
            : <div className="rounded-xl border bg-card"><DocumentTable documents={shown} sortKey={sortKey} direction={direction} onSort={sortBy} showFolder={folder === null} scores={scores} isConfidential={(doc) => isConfidentialDocument(doc, policies)} onAi={runAi} /></div>}
        </>
      )}
      <NewFolderDialog open={folderOpen} onOpenChange={setFolderOpen} existing={allFolders.map((item) => item.name)} onCreate={(name) => { setFolders((list) => [...list, name]); setFolder(name); setTab("files"); }} />
    </MotoPage>
  );
}
