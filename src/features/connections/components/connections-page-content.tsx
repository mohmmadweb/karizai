"use client";

import { useState } from "react";
import { PlugIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { simulateRequest } from "@/lib/simulate-request";
import type { Connection } from "../types";
import { useConnections } from "./connections-provider";

const statusBadge = {
  ready: <Badge variant="success">آماده</Badge>,
  "needs-auth": <Badge variant="warning">نیازمند ورود</Badge>,
} as const;

function ConnectionCard({ item }: { item: Connection }) {
  const { signIn } = useConnections();
  const [busy, setBusy] = useState(false);
  async function login() {
    setBusy(true);
    await simulateRequest(900);
    signIn(item.id);
    setBusy(false);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">{item.name}{statusBadge[item.status]}</CardTitle>
        <CardDescription>{item.domain}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-body-sm">
        <p className="text-muted-foreground">{item.description}</p>
        <p>ابزارها: {item.tools.length ? item.tools.map((tool) => tool.name).join("، ") : "بعد از تأیید ادمین فهرست می‌شود"}</p>
        {item.endpoint ? <p>نشانی نقطه‌ی پایانی (غیرمحرمانه): <bdi dir="ltr" className="font-mono">{item.endpoint}</bdi></p> : null}
        {item.status === "needs-auth" ? <Button size="sm" className="w-fit" loading={busy} onClick={() => void login()}>ورود به {item.name}</Button> : null}
      </CardContent>
    </Card>
  );
}

export function ConnectionsPageContent() {
  const { connections } = useConnections();
  const [query, setQuery] = useState("");
  const filtered = connections.filter((item) => `${item.name} ${item.domain}`.includes(query.trim()));

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-8 page-gutter py-8">
      <PageHeader title="اتصال‌ها" description="اتصال، پیوندی به سامانه‌های سازمان است که چند ابزار دارد. اتصال‌ها را ادمین تعریف می‌کند و اینجا اتصال‌هایی را می‌بینید که به شما دسترسی داده شده؛ برای اتصال تازه با ادمین تماس بگیرید." />
      <SearchField value={query} onValueChange={setQuery} label="جست‌وجو در اتصال‌ها" placeholder="جست‌وجو در اتصال‌ها" />
      {connections.length === 0 ? (
        <EmptyState icon={<PlugIcon />} title="اتصالی در دسترس شما نیست" description="برای دسترسی به اتصال‌های سازمان با ادمین تماس بگیرید." />
      ) : filtered.length === 0 ? (
        <p className="py-6 text-center text-body text-muted-foreground">اتصالی پیدا نشد.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <ConnectionCard key={item.id} item={item} />)}</div>
      )}
    </div>
  );
}
