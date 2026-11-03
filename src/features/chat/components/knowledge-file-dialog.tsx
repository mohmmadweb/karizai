"use client";

import { useState } from "react";
import { FileSpreadsheetIcon, FileTextIcon, LockIcon } from "lucide-react";
import { SearchField } from "@/components/shared/search-field";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getKnowledgeDocuments, isConfidentialDocument } from "@/features/knowledge/data/documents";
import { usePolicies } from "@/lib/policy-store";
import type { AttachmentKind } from "../types";

type KnowledgeFileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (file: { docId: string; name: string; kind: AttachmentKind; confidential: boolean }) => void;
};

/** «📎 فایل از کاریز»: attach one of the organization's files the user may read. */
export function KnowledgeFileDialog({ open, onOpenChange, onPick }: KnowledgeFileDialogProps) {
  const { confidentialDocIds } = usePolicies();
  const [query, setQuery] = useState("");
  const docs = getKnowledgeDocuments().filter((doc) => `${doc.title} ${doc.source}`.includes(query.trim()));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>فایل از کاریز</DialogTitle>
          <DialogDescription>فقط فایل‌هایی دیده می‌شوند که اجازه‌ی خواندنشان را دارید. فایل محرمانه فقط با مدل داخلی خوانده می‌شود.</DialogDescription>
        </DialogHeader>
        <SearchField value={query} onValueChange={setQuery} label="جست‌وجو در فایل‌ها" placeholder="جست‌وجو در فایل‌ها" className="sm:max-w-none" />
        <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
          {docs.length === 0 ? <li className="py-6 text-center text-body-sm text-muted-foreground">فایلی پیدا نشد.</li> : null}
          {docs.map((doc) => {
            const confidential = isConfidentialDocument(doc, confidentialDocIds);
            const Icon = doc.kind === "excel" ? FileSpreadsheetIcon : FileTextIcon;
            return (
              <li key={doc.id}>
                <button
                  type="button"
                  onClick={() => { onPick({ docId: doc.id, name: doc.title, kind: doc.kind, confidential }); onOpenChange(false); }}
                  className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-start outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-label">{doc.title}</span>
                    <span className="text-caption text-muted-foreground">{doc.source}</span>
                  </span>
                  {confidential ? <Badge variant="warning"><LockIcon aria-hidden />محرمانه</Badge> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
