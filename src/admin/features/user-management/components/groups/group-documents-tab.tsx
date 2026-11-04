"use client";

import { useState } from "react";
import Link from "next/link";
import { FileTextIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchField } from "@/components/shared/search-field";
import { buttonVariants } from "@/components/ui/button";
import { useDocuments } from "@/admin/features/documents/hooks/use-documents";
import { protocolLabel } from "@/admin/features/documents/lib/selectors";
import type { Group } from "../../types";
import { AccessToggleRow } from "./access-toggle-row";
import { inactiveReason, useGroupGrant } from "./use-group-grant";

const norm = (v: string) => v.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();

/** Folders and documents this group may use. A folder gives all its documents. */
export function GroupDocumentsTab({ group }: { group: Group }) {
  const { documents, sources } = useDocuments();
  const folders = useGroupGrant(group, "folder");
  const docs = useGroupGrant(group, "document");
  const [query, setQuery] = useState("");
  const q = norm(query);
  const shownSources = sources.filter((s) => !q || norm(s.name).includes(q));
  const shownDocs = documents.filter((d) => !q || norm(d.name).includes(q));
  const locked = group.status === "inactive" ? inactiveReason : undefined;

  if (documents.length === 0 && sources.length === 0) {
    return (
      <EmptyState
        icon={<FileTextIcon />}
        title="هنوز سند یا منبعی نیست"
        description="ابتدا در بخش «اسناد» سند بارگذاری کنید یا منبع فایل‌سرور اضافه کنید."
        action={<Link href="/admin/documents" className={buttonVariants({ variant: "outline" })}>رفتن به اسناد</Link>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-reading text-body-sm text-muted-foreground">
        دسترسی به یک پوشه‌ی فایل‌سرور یعنی همه‌ی اسناد حاضر و آینده‌ی همان پوشه. دسترسی هر سند را هم می‌توانید جدا بدهید.
      </p>
      {locked ? <p className="text-body-sm text-muted-foreground">{locked}</p> : null}
      <SearchField label="جست‌وجوی سند یا منبع" placeholder="جست‌وجو بر اساس نام" value={query} onValueChange={setQuery} />
      {shownSources.length === 0 && shownDocs.length === 0 ? (
        <p className="text-body-sm text-muted-foreground">موردی پیدا نشد.</p>
      ) : null}
      {shownSources.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-h4 text-foreground">منبع‌های فایل‌سرور</h2>
          <ul className="flex flex-col divide-y rounded-xl border bg-card">
            {shownSources.map((s) => (
              <AccessToggleRow
                key={s.id}
                id={`gdoc-folder-${s.id}`}
                name={s.name}
                label={`دسترسی به پوشه‌ی ${s.name}`}
                hint={<bdi dir="ltr">{protocolLabel[s.protocol]}</bdi>}
                checked={folders.has(s.id)}
                disabled={Boolean(locked)}
                onChange={(on) => folders.set(s.id, on, s.name)}
              />
            ))}
          </ul>
        </section>
      ) : null}
      {shownDocs.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-h4 text-foreground">اسناد</h2>
          <ul className="flex flex-col divide-y rounded-xl border bg-card">
            {shownDocs.map((d) => {
              const viaFolder = d.sourceId !== null && folders.has(d.sourceId);
              return (
                <AccessToggleRow
                  key={d.id}
                  id={`gdoc-doc-${d.id}`}
                  name={d.name}
                  label={`دسترسی به سند ${d.name}`}
                  badges={d.confidential ? ["محرمانه"] : []}
                  checked={viaFolder || docs.has(d.id)}
                  lockedReason={viaFolder ? "از طریق پوشه" : undefined}
                  disabled={Boolean(locked)}
                  onChange={(on) => docs.set(d.id, on, d.name)}
                />
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
