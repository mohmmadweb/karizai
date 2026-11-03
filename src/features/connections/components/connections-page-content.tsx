"use client";

import { useState } from "react";
import { PlugIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConnectionIcon } from "./connection-icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { simulateRequest } from "@/lib/simulate-request";
import { gatewayOf, gateways, isReadOnly } from "../data/gateways";
import type { Connection } from "../types";
import { useConnections } from "./connections-provider";

const statusBadge = {
  ready: <Badge variant="success">متصل</Badge>,
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
        <CardTitle className="flex flex-wrap items-center gap-2"><ConnectionIcon name={item.name} domain={item.domain} />{item.name}{statusBadge[item.status]}{isReadOnly(item) ? <Badge variant="outline">فقط‌خواندنی</Badge> : null}</CardTitle>
        <CardDescription>{item.adapter === "kariz" ? "آداپتر کاریز" : "آداپتر بیرونی"} · {item.domain}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-body-sm">
        <p className="text-muted-foreground">{item.description}</p>
        <p>ابزارها: {item.tools.length ? item.tools.map((tool) => tool.name).join("، ") : "بعد از تأیید ادمین فهرست می‌شود"}</p>
        {item.endpoint ? <p className="flex flex-col gap-0.5">نشانی نقطه‌ی پایانی (غیرمحرمانه):<bdi dir="ltr" className="break-all text-start font-mono text-caption text-muted-foreground">{item.endpoint}</bdi></p> : null}
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
      <PageHeader title="اتصال‌ها" description="هر درگاه یک قرارداد استاندارد دارد؛ سازمان می‌تواند آداپتر کاریز یا سامانه‌ی خودش را به آن وصل کند. اتصال‌ها را ادمین تعریف می‌کند و اینجا آن‌هایی را می‌بینید که به شما دسترسی داده شده." />
      <SearchField value={query} onValueChange={setQuery} label="جست‌وجو در اتصال‌ها" placeholder="جست‌وجو در اتصال‌ها" />
      {connections.length === 0 ? (
        <EmptyState icon={<PlugIcon />} title="اتصالی در دسترس شما نیست" description="برای دسترسی به اتصال‌های سازمان با ادمین تماس بگیرید." />
      ) : filtered.length === 0 ? (
        <p className="py-6 text-center text-body text-muted-foreground">اتصالی پیدا نشد.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {gateways.map((gateway) => {
            const items = filtered.filter((item) => gatewayOf(item) === gateway.id);
            if (items.length === 0 && !(gateway.karizAdapter && !query.trim())) return null;
            return (
              <section key={gateway.id} className="flex flex-col gap-4" aria-labelledby={`gateway-${gateway.id}`}>
                <div className="flex flex-col gap-1">
                  <h2 id={`gateway-${gateway.id}`} className="text-h4">درگاه {gateway.name}</h2>
                  <p className="text-body-sm text-muted-foreground">{gateway.description}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {gateway.karizAdapter && !query.trim() ? (
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle className="flex flex-wrap items-center gap-2"><ConnectionIcon name={gateway.karizAdapter} />{gateway.karizAdapter}<Badge variant="success">فعال</Badge></CardTitle>
                        <CardDescription>آداپتر کاریز · درگاه {gateway.name}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-body-sm text-muted-foreground">بخشی از خود کاریز است و نیازی به اتصال جداگانه ندارد.</CardContent>
                    </Card>
                  ) : null}
                  {items.map((item) => <ConnectionCard key={item.id} item={item} />)}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
