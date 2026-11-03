"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiKeyKindLabels } from "@/lib/api-keys";
import { apiBase, endpoints } from "../data/endpoints";
import { snippet } from "../lib/snippets";
import { CodeBlock } from "./code-block";

/** Reference of the `/api/v1` gateway: one card per endpoint with request, response and snippets. */
export function DocsTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 rounded-xl border p-4 text-body-sm">
        <p>نشانی پایه: <bdi dir="ltr" className="font-mono">{apiBase}</bdi></p>
        <p className="text-muted-foreground">هر درخواست سرآیند <bdi dir="ltr" className="font-mono">Authorization: Bearer &lt;کلید&gt;</bdi> دارد. دسترسی کلید از دسترسی سازنده‌اش بیشتر نیست، مصرف آن در «مصرف من» حساب می‌شود و همه‌ی فراخوانی‌ها در گزارش ممیزی ادمین ثبت می‌شوند. تیم داخلی یا پیمانکار می‌تواند با همین API روی کاریز توسعه دهد.</p>
      </div>
      {endpoints.map((endpoint) => (
        <section key={endpoint.id} id={`api-${endpoint.id}`} className="flex flex-col gap-3 rounded-xl border p-4" aria-labelledby={`api-title-${endpoint.id}`}>
          <h3 id={`api-title-${endpoint.id}`} className="flex flex-wrap items-center gap-2 text-h4">
            {endpoint.title}
            <Badge variant="outline"><bdi dir="ltr" className="font-mono">{endpoint.method} {endpoint.path}</bdi></Badge>
            <Badge variant="secondary">{endpoint.keyKind ? `کلید ${apiKeyKindLabels[endpoint.keyKind]}` : "هر کلید"}</Badge>
          </h3>
          <p className="text-body-sm text-muted-foreground">{endpoint.description}</p>
          <div className="grid gap-3 lg:grid-cols-2">
            {endpoint.request ? <div className="flex min-w-0 flex-col gap-1"><span className="text-label">درخواست</span><CodeBlock code={JSON.stringify(endpoint.request, null, 2)} label="درخواست" /></div> : null}
            <div className="flex min-w-0 flex-col gap-1"><span className="text-label">پاسخ</span><CodeBlock code={JSON.stringify(endpoint.response, null, 2)} label="پاسخ" /></div>
          </div>
          <Tabs defaultValue="curl">
            <TabsList>
              <TabsTrigger value="curl">curl</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            </TabsList>
            {(["curl", "python", "javascript"] as const).map((language) => (
              <TabsContent key={language} value={language} className="pt-2"><CodeBlock code={snippet(endpoint, language)} label={`نمونه‌ی ${language}`} /></TabsContent>
            ))}
          </Tabs>
        </section>
      ))}
    </div>
  );
}
