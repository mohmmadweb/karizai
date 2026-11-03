"use client";

import { PageHeader } from "@/components/shared/page-header";
import { MaskingPanel } from "./masking-panel";

/** Stand-alone page with the same panel as the «پوشاندن داده» tab of the rules center. */
export function MaskingPageContent() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="پوشاندن داده" description="کدام داده‌ها پیش از ارسال به مدل بیرونی پوشانده شوند و کدام هرگز بیرون نروند." />
      <MaskingPanel />
    </div>
  );
}
