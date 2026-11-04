import { getFontWeights } from "../data/reference";
import { BrandLogoGrid } from "./brand-logo-grid";
import { PreviewGroup, PreviewSection } from "./preview-section";

export function BrandSection() {
  return (
    <PreviewSection
      id="brand"
      title="برند"
    >
      <PreviewGroup title="لوگو: سه نسخه (در تم روشن لوگوی عادی، در تم تیره لوگوی سفید)">
        <BrandLogoGrid />
      </PreviewGroup>
      <PreviewGroup title="فونت IRANSansX، نُه وزن">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {getFontWeights().map((item) => (
            <div
              key={item.weight}
              className="flex items-center justify-between gap-4 bg-card px-4 py-3"
            >
              <span className={`text-body-lg ${item.className}`}>
                کاریز ۱۲۳۴۵۶۷۸۹۰
              </span>
              <span dir="ltr" className="text-caption text-muted-foreground">
                {item.weight} {item.name}
              </span>
            </div>
          ))}
        </div>
      </PreviewGroup>
      <PreviewGroup title="رنگ‌های برند">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex h-24 items-end rounded-xl bg-primary p-4 text-label text-primary-foreground">
            اصلی: سورمه‌ای
          </div>
          <div className="flex h-24 items-end rounded-xl bg-secondary p-4 text-label text-secondary-foreground">
            ثانویه: فیروزه‌ای آرام
          </div>
        </div>
      </PreviewGroup>
    </PreviewSection>
  );
}
