"use client";

import { useState } from "react";
import { LockKeyholeIcon, SearchXIcon, ShieldAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchField } from "@/components/shared/search-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { usePolicies } from "@/admin/features/policies/components/policies-provider";
import { useDocuments } from "../hooks/use-documents";
import { formatBytes, formatNumber } from "@/admin/lib/format";
import { sourceOf } from "../lib/selectors";

type Filter = "all" | "confidential" | "open";

const filterItems: { value: Filter; label: string }[] = [
  { value: "all", label: "همه‌ی اسناد" },
  { value: "confidential", label: "فقط محرمانه‌ها" },
  { value: "open", label: "فقط غیرمحرمانه‌ها" },
];

const norm = (v: string) => v.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();

/** Marks documents confidential in one place. A confidential document only works with internal models. */
export function ConfidentialityTab() {
  const { documents, sources } = useDocuments();
  const { models, providers } = useModels();
  const { setConfidential, saving, loading } = usePolicies();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const confidentialIds = documents.filter((d) => d.confidential).map((d) => d.id);
  const internal = models.filter((m) => m.selfHosted && m.enabled);
  const providerName = (id: string) => providers.find((p) => p.id === id)?.name;
  const q = norm(query);
  const visible = documents.filter(
    (d) =>
      (filter === "all" || (filter === "confidential") === d.confidential) &&
      (!q || norm(d.name).includes(q) || norm(d.fileName).includes(q)),
  );

  async function change(id: string, name: string, flag: boolean) {
    const ok = await setConfidential(id, flag, confidentialIds);
    if (ok) toast.success(flag ? `«${name}» محرمانه شد؛ فقط مدل داخلی با آن کار می‌کند.` : `نشان محرمانه از «${name}» برداشته شد.`);
    else toast.error("ذخیره نشد؛ دوباره تلاش کنید.");
  }

  if (documents.length === 0) {
    return <EmptyState icon={<LockKeyholeIcon />} title="هنوز سندی نیست" description="ابتدا در تب «اسناد» سند بارگذاری کنید." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-reading text-body text-foreground">
        سند محرمانه فقط با مدل‌های داخلی (سلف‌هاست) کار می‌کند و هرگز به مدل خارجی داده نمی‌شود. همچنین فقط گروه‌هایی آن را می‌بینند که صریحاً به آن دسترسی گرفته‌اند.
      </p>
      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-xl border bg-card p-4">
          <dt className="text-body-sm text-muted-foreground">اسناد محرمانه</dt>
          <dd className="text-h3 tabular-nums">{formatNumber(confidentialIds.length)} <span className="text-body-sm font-normal text-muted-foreground">از {formatNumber(documents.length)}</span></dd>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border bg-card p-4">
          <dt className="text-body-sm text-muted-foreground">مدل‌های داخلی فعال</dt>
          <dd className="text-h3 tabular-nums">{formatNumber(internal.length)}</dd>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
          <dt className="text-body-sm text-muted-foreground">مدل‌هایی که اسناد محرمانه را می‌بینند</dt>
          <dd>
            {internal.length === 0 ? (
              <span className="text-body-sm text-muted-foreground">هیچ‌کدام</span>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {internal.map((m) => (
                  <li key={m.id}><Badge variant="outline"><bdi dir="ltr">{m.displayName}</bdi>{providerName(m.providerId) ? ` · ${providerName(m.providerId)}` : ""}</Badge></li>
                ))}
              </ul>
            )}
          </dd>
        </div>
      </dl>
      {confidentialIds.length > 0 && internal.length === 0 ? (
        <Alert variant="warning">
          <ShieldAlertIcon aria-hidden />
          <AlertTitle>سند محرمانه با هیچ مدلی قابل استفاده نیست</AlertTitle>
          <AlertDescription>هیچ مدل داخلی فعالی نیست؛ یک مدل سلف‌هاست را در بخش «مدل‌ها» فعال کنید.</AlertDescription>
        </Alert>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <SearchField label="جست‌وجوی اسناد" placeholder="جست‌وجو بر اساس نام سند" value={query} onValueChange={setQuery} />
        <Select items={filterItems} value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <SelectTrigger aria-label="نمایش اسناد" className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{filterItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </div>
      {visible.length === 0 ? (
        <EmptyState
          icon={<SearchXIcon />}
          title="سندی پیدا نشد"
          description="نام یا نمایش دیگری را امتحان کنید."
          action={<Button variant="outline" onClick={() => { setQuery(""); setFilter("all"); }}>پاک‌کردن جست‌وجو و فیلتر</Button>}
        />
      ) : (
        <ul className="flex flex-col divide-y rounded-xl border bg-card">
          {visible.map((d) => (
            <li key={d.id} className="flex min-h-14 items-center justify-between gap-3 px-4 py-2">
              <div className="flex min-w-0 flex-col gap-0.5">
                <label htmlFor={`conf-${d.id}`} className="text-label text-foreground">{d.name}</label>
                <span className="text-body-sm text-muted-foreground">
                  {d.extension.toUpperCase()} · {formatBytes(d.sizeBytes)} · {sourceOf(d, sources)?.name ?? "بارگذاری دستی"}
                </span>
              </div>
              <span className="flex shrink-0 items-center gap-3">
                {d.confidential ? <Badge variant="secondary">محرمانه</Badge> : null}
                <Switch id={`conf-${d.id}`} aria-label={`محرمانه بودن ${d.name}`} checked={d.confidential} disabled={saving || loading} onCheckedChange={(on) => change(d.id, d.name, on)} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
