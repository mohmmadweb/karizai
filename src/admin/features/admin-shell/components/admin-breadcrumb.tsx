"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { isSectionPath } from "../data/admin-sections";
import type { AdminSection } from "../types";

/** «ادمین › بخش فعلی». The root item is text because there is no admin home. */
function Trail({ sectionTitle }: { sectionTitle: string }) {
  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap text-body-sm">
        <BreadcrumbItem>ادمین</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="truncate">{sectionTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function CurrentTrail({ sections }: { sections: AdminSection[] }) {
  const pathname = usePathname();
  const current = sections.find((s) => isSectionPath(pathname, s));
  return <Trail sectionTitle={current?.title ?? "پنل ادمین"} />;
}

/** The pathname is runtime data, so it is read inside a Suspense boundary. */
export function AdminBreadcrumb({ sections }: { sections: AdminSection[] }) {
  return (
    <Suspense fallback={<Trail sectionTitle="پنل ادمین" />}>
      <CurrentTrail sections={sections} />
    </Suspense>
  );
}
