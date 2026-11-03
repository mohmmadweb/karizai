import { formatDate, formatNumber, formatPercent, formatPrice } from "@/admin/lib/format";
import { PreviewGroup, PreviewSection } from "./preview-section";

const sampleDate = "2026-10-12T09:30:00Z";

export function PersianTextSection() {
  const rows = [
    { label: "نیم‌فاصله", value: "می‌شود، کتاب‌ها، نرم‌افزار" },
    { label: "ارقام فارسی", value: "۰۱۲۳۴۵۶۷۸۹" },
    { label: "عدد قالب‌بندی‌شده", value: formatNumber(1234567.89) },
    { label: "مبلغ", value: formatPrice(1250000, "تومان") },
    { label: "درصد", value: formatPercent(0.256) },
    { label: "تاریخ", value: formatDate(sampleDate) },
  ];
  return (
    <PreviewSection
      id="persian-text"
      title="متن فارسی"
    >
      <PreviewGroup title="اعداد، مبلغ و تاریخ">
        <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 bg-card px-4 py-3">
              <dt className="text-body-sm text-muted-foreground">{row.label}</dt>
              <dd className="text-body tabular-nums">{row.value}</dd>
            </div>
          ))}
        </dl>
      </PreviewGroup>
      <PreviewGroup title="ترکیب متن فارسی و لاتین">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-body">
          <p>
            نشانی ایمیل <bdi dir="ltr">name@example.com</bdi> و پیوند{" "}
            <bdi dir="ltr">https://example.com/path</bdi> در جمله درست نمایش داده می‌شوند.
          </p>
          <p>
            کد پیگیری: <bdi dir="ltr">AB-1024-XZ</bdi>، شماره تماس:{" "}
            <bdi dir="ltr">+98 21 0000 0000</bdi>
          </p>
        </div>
      </PreviewGroup>
    </PreviewSection>
  );
}
