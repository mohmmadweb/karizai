import type { Metadata } from "next";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PageHeader } from "@/components/shared/page-header";
import { ActionsSection } from "@/admin/features/design-system/components/actions-section";
import { BrandSection } from "@/admin/features/design-system/components/brand-section";
import { DataDisplaySection } from "@/admin/features/design-system/components/data-display-section";
import { FeedbackSection } from "@/admin/features/design-system/components/feedback-section";
import { FormsSection } from "@/admin/features/design-system/components/forms-section";
import { NavigationOverlaysSection } from "@/admin/features/design-system/components/navigation-overlays-section";
import { PagePatternsSection } from "@/admin/features/design-system/components/page-patterns-section";
import { PersianTextSection } from "@/admin/features/design-system/components/persian-text-section";
import { TokensSection } from "@/admin/features/design-system/components/tokens-section";

export const metadata: Metadata = {
  title: "سیستم طراحی | موشکاف",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return (
    <main className="page-gutter mx-auto flex w-full max-w-page flex-col gap-12 py-8 md:py-12">
      <PageHeader
        title="سیستم طراحی"
        action={<ThemeToggle />}
      />
      <BrandSection />
      <TokensSection />
      <PersianTextSection />
      <ActionsSection />
      <FormsSection />
      <FeedbackSection />
      <NavigationOverlaysSection />
      <DataDisplaySection />
      <PagePatternsSection />
    </main>
  );
}
