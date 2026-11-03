"use client";

import { useState } from "react";
import { FileTextIcon, PlusIcon, SearchXIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocuments } from "../../hooks/use-documents";
import { statusLabel } from "../../lib/pipeline";
import { filterDocuments } from "../../lib/selectors";
import type { DocStatus } from "../../types";
import { DocumentsList } from "./documents-list";

const statusItems = [
  { value: "all", label: "همه‌ی وضعیت‌ها" },
  ...(Object.keys(statusLabel) as DocStatus[]).map((s) => ({ value: s, label: statusLabel[s] })),
];

export function DocumentsTab({ onUpload }: { onUpload: () => void }) {
  const { documents } = useDocuments();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<DocStatus | "all">("all");

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<FileTextIcon />}
        title="هنوز سندی اضافه نشده است"
        description="با بارگذاری اولین سند شروع کنید."
        action={<Button onClick={onUpload}><PlusIcon aria-hidden />بارگذاری سند</Button>}
      />
    );
  }

  const visible = filterDocuments(documents, query, status);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchField label="جست‌وجوی اسناد" placeholder="جست‌وجو بر اساس نام سند" value={query} onValueChange={setQuery} />
        <Select items={statusItems} value={status} onValueChange={(v) => setStatus(v as DocStatus | "all")}>
          <SelectTrigger aria-label="وضعیت پردازش" className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {statusItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {visible.length === 0 ? (
        <EmptyState
          icon={<SearchXIcon />}
          title="سندی پیدا نشد"
          description="نام یا وضعیت دیگری را امتحان کنید."
          action={<Button variant="outline" onClick={() => { setQuery(""); setStatus("all"); }}>پاک‌کردن جست‌وجو و فیلتر</Button>}
        />
      ) : (
        <DocumentsList docs={visible} />
      )}
    </div>
  );
}
