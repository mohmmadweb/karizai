"use client";

import Link from "next/link";
import { DatabaseIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { useDataSources } from "@/admin/features/data-sources/hooks/use-data-sources";
import type { Group } from "../../types";
import { AccessToggleRow } from "./access-toggle-row";
import { inactiveReason, useGroupGrant } from "./use-group-grant";

/** Databases and their schemas this group may use. A whole database gives all its schemas. */
export function GroupDataTab({ group }: { group: Group }) {
  const { sources, dataSchemas } = useDataSources();
  const databases = useGroupGrant(group, "database");
  const schemas = useGroupGrant(group, "schema");
  const locked = group.status === "inactive" ? inactiveReason : undefined;

  if (sources.length === 0) {
    return (
      <EmptyState
        icon={<DatabaseIcon />}
        title="هنوز اتصال پایگاه داده‌ای نیست"
        description="ابتدا در بخش «داده» یک اتصال تعریف کنید."
        action={<Link href="/admin/data" className={buttonVariants({ variant: "outline" })}>رفتن به داده</Link>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-reading text-body-sm text-muted-foreground">
        «کل پایگاه» همه‌ی جدول‌ها را می‌دهد؛ دسترسی به یک اسکیما فقط جدول‌های همان اسکیما را. اسکیماها را در صفحه‌ی هر اتصال، تب «اسکیماها» می‌سازید.
      </p>
      {locked ? <p className="text-body-sm text-muted-foreground">{locked}</p> : null}
      {sources.map((source) => {
        const whole = databases.has(source.id);
        const mine = dataSchemas.filter((s) => s.sourceId === source.id);
        const tested = source.testResult === "success";
        return (
          <section key={source.id} className="flex flex-col gap-2">
            <ul className="flex flex-col divide-y rounded-xl border bg-card">
              <AccessToggleRow
                id={`gdata-db-${source.id}`}
                name={<span className="text-h4">{source.name}</span>}
                label={`دسترسی به کل پایگاه ${source.name}`}
                hint="کل پایگاه"
                checked={whole}
                disabled={Boolean(locked)}
                onChange={(on) => databases.set(source.id, on, source.name)}
              />
              {tested
                ? mine.map((schema) => (
                    <AccessToggleRow
                      key={schema.id}
                      id={`gdata-schema-${schema.id}`}
                      name={`اسکیمای ${schema.name}`}
                      label={`دسترسی به اسکیمای ${schema.name} از پایگاه ${source.name}`}
                      hint={[schema.description, schema.rowFilter ? `فیلتر سطری: ${schema.rowFilter}` : ""].filter(Boolean).join(" · ") || undefined}
                      badges={schema.confidential ? ["محرمانه"] : []}
                      className="ps-8"
                      checked={whole || schemas.has(schema.id)}
                      lockedReason={whole ? "از طریق کل پایگاه" : undefined}
                      disabled={Boolean(locked)}
                      onChange={(on) => schemas.set(schema.id, on, schema.name)}
                    />
                  ))
                : null}
            </ul>
            {!tested ? <p className="px-1 text-caption text-muted-foreground">اسکیماها بعد از آزمایش اتصال دیده می‌شوند.</p> : null}
            {tested && mine.length === 0 ? <p className="px-1 text-caption text-muted-foreground">این پایگاه هنوز اسکیمایی ندارد.</p> : null}
          </section>
        );
      })}
    </div>
  );
}
