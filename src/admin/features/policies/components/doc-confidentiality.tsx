"use client";

import { useState } from "react";
import { FileTextIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { useDocConfidential } from "@/admin/features/documents/hooks/use-doc-confidential";
import { useDocuments } from "@/admin/features/documents/hooks/use-documents";
import type { DocumentRecord } from "@/admin/features/documents/types";
import { formatNumber } from "@/admin/lib/format";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchField } from "@/components/shared/search-field";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

/** «محرمانگی اسناد»: a confidential document is never read by an external model. */
export function DocConfidentiality() {
  const { documents } = useDocuments();
  const { isConfidential, setDocConfidential } = useDocConfidential();
  const [query, setQuery] = useState("");
  const rows = documents.filter((d) => d.name.includes(query.trim()) || d.fileName.includes(query.trim()));
  const count = documents.filter(isConfidential).length;

  const toggle = (doc: DocumentRecord, value: boolean) => {
    setDocConfidential(doc, value);
    toast.success(value ? `«${doc.name}» محرمانه شد؛ فقط مدل داخلی آن را می‌خواند.` : `«${doc.name}» دیگر محرمانه نیست.`);
  };

  const columns: DataTableColumn<DocumentRecord>[] = [
    {
      id: "name",
      header: "سند",
      cell: (d) => (
        <span className="flex flex-col">
          <span className="font-medium">{d.name}</span>
          <bdi dir="ltr" className="text-start text-caption text-muted-foreground">{d.fileName}</bdi>
        </span>
      ),
    },
    {
      id: "models",
      header: "مدل‌هایی که می‌خوانند",
      cell: (d) =>
        isConfidential(d) ? <Badge variant="warning">فقط مدل داخلی</Badge> : <Badge variant="outline">داخلی و بیرونی (با پوشاندن)</Badge>,
    },
    {
      id: "confidential",
      header: "محرمانه",
      cell: (d) => <Switch checked={isConfidential(d)} onCheckedChange={(c) => toggle(d, c)} aria-label={`سند ${d.name} محرمانه باشد`} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-body-sm text-muted-foreground">
        {formatNumber(count)} سند از {formatNumber(documents.length)} سند محرمانه است. مدل‌های بیرونی هیچ‌وقت سند محرمانه را نمی‌خوانند؛
        پرسشی که به آن نیاز دارد خودکار به مدل داخلی می‌رود.
      </p>
      <SearchField label="جست‌وجوی اسناد" placeholder="نام سند" value={query} onValueChange={setQuery} />
      {rows.length === 0 ? (
        <EmptyState icon={<FileTextIcon />} title="سندی پیدا نشد" description="نام دیگری را امتحان کنید." />
      ) : (
        <DataTable label="محرمانگی اسناد" rows={rows} columns={columns} getRowId={(d) => d.id} getRowLabel={(d) => `سند ${d.name}`} />
      )}
    </div>
  );
}
