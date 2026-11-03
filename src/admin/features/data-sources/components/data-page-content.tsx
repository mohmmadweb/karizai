"use client";

import { useState } from "react";
import { DatabaseIcon, PlusIcon, SearchXIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { useDataSources } from "../hooks/use-data-sources";
import { filterSources } from "../lib/selectors";
import { AddSourceDialog } from "./add-source-dialog";
import { SourcesList } from "./list/sources-list";

export function DataPageContent() {
  const { sources } = useDataSources();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const visible = filterSources(sources, query);

  const addButton = (
    <Button onClick={() => setAdding(true)}>
      <PlusIcon aria-hidden />
      افزودن اتصال
    </Button>
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="داده"
        description="اتصال به انبار داده‌ی سازمان و تعیین اینکه چه کسانی از آن‌ها استفاده کنند."
        action={addButton}
      />
      {sources.length === 0 ? (
        <EmptyState
          icon={<DatabaseIcon />}
          title="هنوز اتصالی اضافه نشده است"
          description="با افزودن اولین اتصال به انبار داده شروع کنید."
          action={addButton}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <SearchField
            label="جست‌وجوی اتصال‌ها"
            placeholder="جست‌وجو بر اساس نام اتصال"
            value={query}
            onValueChange={setQuery}
          />
          {visible.length === 0 ? (
            <EmptyState
              icon={<SearchXIcon />}
              title="اتصالی پیدا نشد"
              description="نام دیگری را امتحان کنید."
              action={
                <Button variant="outline" onClick={() => setQuery("")}>
                  پاک‌کردن جست‌وجو
                </Button>
              }
            />
          ) : (
            <SourcesList sources={visible} />
          )}
        </div>
      )}
      <AddSourceDialog open={adding} onOpenChange={setAdding} />
    </div>
  );
}
