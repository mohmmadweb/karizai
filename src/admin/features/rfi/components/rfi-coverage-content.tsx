"use client";

import { useMemo, useState } from "react";
import Link from "@/components/shared/app-link";
import { ArrowUpLeftIcon, CheckCircle2Icon, FileTextIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { rfiItems, type RfiStatus } from "../data/rfi-items";

const n = (v: number) => v.toLocaleString("fa-IR");
type Filter = "all" | RfiStatus;

/**
 * «نقشه‌ی پوشش RFI»: every requirement of the Parsa Polymer RFI, whether it can be
 * shown in this demo, and a direct link to the page that shows it.
 */
export function RfiCoverageContent() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const demo = rfiItems.filter((item) => item.status === "demo").length;
  const visible = useMemo(
    () => rfiItems.filter((item) => (filter === "all" || item.status === filter) && `${item.id} ${item.title} ${item.how}`.includes(query.trim())),
    [filter, query],
  );
  const sections = [...new Set(visible.map((item) => item.section))];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="نقشه‌ی پوشش RFI" description="همه‌ی نیازمندی‌های درخواست اطلاعات پارسا پلیمر شریف، به ترتیب سند، با جای نمایش هر کدام در دمو." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="کل نیازمندی‌ها" value={n(rfiItems.length)} />
        <Stat label="قابل نمایش در دمو" value={n(demo)} tone="success" />
        <Stat label="در پاسخ مکتوب یا پیشنهاد تجاری" value={n(rfiItems.length - demo)} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <TabsList>
            <TabsTrigger value="all">همه</TabsTrigger>
            <TabsTrigger value="demo">در دمو</TabsTrigger>
            <TabsTrigger value="written">مکتوب</TabsTrigger>
          </TabsList>
        </Tabs>
        <SearchField value={query} onValueChange={setQuery} label="جست‌وجو در نیازمندی‌ها" placeholder="شناسه یا عنوان، مثلاً R4.7 یا پوشاندن" />
      </div>
      {sections.map((section) => (
        <section key={section} aria-label={section} className="flex flex-col gap-3">
          <h2 className="text-h4">{section}</h2>
          <ul className="flex flex-col divide-y rounded-xl border bg-card">
            {visible.filter((item) => item.section === section).map((item) => (
              <li key={item.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
                <span className="w-14 shrink-0 font-mono text-caption text-muted-foreground" dir="ltr">{item.id}</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-body font-medium">{item.title}</span>
                  <span className="text-caption text-muted-foreground">{item.how}</span>
                </div>
                {item.status === "demo" ? (
                  <Badge variant="success"><CheckCircle2Icon aria-hidden />در دمو</Badge>
                ) : (
                  <Badge variant="outline"><FileTextIcon aria-hidden />مکتوب</Badge>
                )}
                {item.href ? (
                  <Link href={item.href} className="inline-flex shrink-0 items-center gap-1 rounded-md text-label text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
                    مشاهده<ArrowUpLeftIcon className="size-4" aria-hidden />
                  </Link>
                ) : <span className="w-16 shrink-0" />}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {visible.length === 0 ? <p className="py-6 text-center text-body text-muted-foreground">موردی پیدا نشد.</p> : null}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <span className="text-caption text-muted-foreground">{label}</span>
        <span className={cn("text-h2", tone === "success" && "text-success")}>{value}</span>
      </CardContent>
    </Card>
  );
}
